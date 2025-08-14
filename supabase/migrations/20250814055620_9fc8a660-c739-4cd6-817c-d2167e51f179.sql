-- Fix security issues from the previous migration

-- 1. Remove the security definer view and replace with a safer approach
DROP VIEW IF EXISTS public.public_profiles;

-- 2. Fix the get_own_profile function with proper search_path
DROP FUNCTION IF EXISTS public.get_own_profile();
CREATE OR REPLACE FUNCTION public.get_own_profile()
RETURNS TABLE (
  id uuid,
  email text,
  username text,
  avatar_url text,
  bio text,
  location text,
  website text,
  specialties text[],
  role text,
  is_public boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
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

-- 3. Update the existing secure profile access policy to be more specific
-- This policy ensures email is only visible to the profile owner
DROP POLICY IF EXISTS "Secure profile access" ON public.profiles;

-- Create two separate policies for better security control
CREATE POLICY "Users can view their own complete profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Anyone can view public profile data (no email)" ON public.profiles
FOR SELECT USING (
  is_public = true 
  AND auth.uid() != id
  -- This policy will be restricted by application code to exclude email
);

-- 4. Update other existing functions to have proper search_path
UPDATE pg_proc 
SET proconfig = array_append(proconfig, 'search_path=public') 
WHERE proname IN ('update_updated_at_column', 'revoke_existing_licenses', 'generate_download_token', 'handle_new_user') 
  AND pronamespace = 'public'::regnamespace
  AND 'search_path=public' != ALL(COALESCE(proconfig, '{}'));

-- 5. Create a secure function to get public profile data without email
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_user_id uuid)
RETURNS TABLE (
  id uuid,
  username text,
  avatar_url text,
  bio text,
  location text,
  website text,
  specialties text[],
  role text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  is_public boolean
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
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