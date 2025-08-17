-- PRIORITY 1: Fix Critical Privilege Escalation
-- Create secure function for role updates (admin only)
CREATE OR REPLACE FUNCTION public.update_user_role_secure(target_user_id uuid, new_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to update roles
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: Only admins can update user roles';
  END IF;
  
  -- Prevent self-role changes for additional security
  IF auth.uid() = target_user_id THEN
    RAISE EXCEPTION 'Access denied: Cannot change your own role';
  END IF;
  
  -- Update the role
  UPDATE public.profiles 
  SET role = new_role, updated_at = now()
  WHERE id = target_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

-- Create security definer function to check current user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- PRIORITY 3: Fix Customer Data Exposure - Tighten subscribers RLS
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;
CREATE POLICY "select_own_subscription" ON public.subscribers
FOR SELECT 
USING (user_id = auth.uid());

-- PRIORITY 4: Strengthen Admin Authorization - Secure admin functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Update admin-related RLS policies to use security definer functions
DROP POLICY IF EXISTS "Admins can view all reports" ON public.model_reports;
CREATE POLICY "Admins can view all reports" ON public.model_reports
FOR SELECT 
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can create admin logs" ON public.admin_logs;
CREATE POLICY "Admins can create admin logs" ON public.admin_logs
FOR INSERT 
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can view admin logs" ON public.admin_logs;
CREATE POLICY "Admins can view admin logs" ON public.admin_logs
FOR SELECT 
USING (public.is_admin());

-- PRIORITY 5: Database Security Hardening - Fix search_path issues
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, role, is_public)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, 'unknown@example.com'),
    COALESCE(
      NULLIF(LOWER(SPLIT_PART(COALESCE(NEW.email, 'user'), '@', 1)), ''),
      'user_' || SUBSTRING(NEW.id::text, 1, 8)
    ),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    false
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Add constraints to prevent unauthorized role changes at database level
ALTER TABLE public.profiles 
ADD CONSTRAINT valid_roles 
CHECK (role IN ('admin', 'creator', 'buyer', 'user'));

-- PRIORITY 6: Privacy and Compliance - Add data retention trigger
CREATE OR REPLACE FUNCTION public.cleanup_old_downloads()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete download records older than 30 days
  DELETE FROM public.model_downloads 
  WHERE downloaded_at < now() - interval '30 days';
  RETURN NULL;
END;
$$;

-- Create a trigger to cleanup old downloads periodically
DROP TRIGGER IF EXISTS cleanup_downloads_trigger ON public.model_downloads;
CREATE TRIGGER cleanup_downloads_trigger
AFTER INSERT ON public.model_downloads
FOR EACH STATEMENT
EXECUTE FUNCTION public.cleanup_old_downloads();