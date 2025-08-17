-- Fix Security Linter Issues

-- Fix remaining functions without search_path
CREATE OR REPLACE FUNCTION public.revoke_existing_licenses(target_model_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE user_licenses 
  SET is_revoked = true, 
      revoked_at = now(), 
      revocation_reason = 'Exclusive license purchased'
  WHERE model_id = target_model_id 
    AND is_revoked = false;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_download_token(user_id_param uuid, model_id_param uuid, license_id_param uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  token text;
BEGIN
  token := encode(gen_random_bytes(32), 'hex');
  
  INSERT INTO model_downloads (user_id, model_id, license_id, download_token, expires_at)
  VALUES (user_id_param, model_id_param, license_id_param, token, now() + interval '1 hour');
  
  RETURN token;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_own_profile()
RETURNS TABLE(id uuid, email text, username text, avatar_url text, bio text, location text, website text, specialties text[], role text, is_public boolean, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.email,
    p.username,
    p.avatar_url,
    p.bio,
    p.location,
    p.website,
    p.specialties,
    p.role,
    p.is_public,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_public_profile_safe(profile_user_id uuid)
RETURNS TABLE(id uuid, username text, avatar_url text, bio text, location text, website text, specialties text[], role text, created_at timestamp with time zone, updated_at timestamp with time zone, is_public boolean)
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.username,
    p.avatar_url,
    p.bio,
    p.location,
    p.website,
    p.specialties,
    p.role,
    p.created_at,
    p.updated_at,
    p.is_public
  FROM public.profiles p
  WHERE p.id = profile_user_id AND p.is_public = true;
$$;

-- Remove potentially problematic materialized view access if it exists
DROP VIEW IF EXISTS public.public_profiles CASCADE;

-- Update the cleanup function to have proper search_path
CREATE OR REPLACE FUNCTION public.cleanup_old_downloads()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Delete download records older than 30 days
  DELETE FROM public.model_downloads 
  WHERE downloaded_at < now() - interval '30 days';
  RETURN NULL;
END;
$$;

-- Fix the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;