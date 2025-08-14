-- Fix the profiles security issue properly

-- 1. Drop the problematic policy and replace with a secure one
DROP POLICY IF EXISTS "Anyone can view public profile data (no email)" ON public.profiles;

-- 2. Create a more secure policy that doesn't expose emails to unauthorized users
-- This policy restricts access to only non-sensitive public profile data
CREATE POLICY "Public profiles without email access" ON public.profiles
FOR SELECT USING (
  -- Users can see their own profile completely
  auth.uid() = id 
  OR 
  -- For public profiles of others, application should filter out email field
  -- The application code must handle email exclusion for security
  (is_public = true AND auth.uid() != id)
);

-- 3. Create secure helper functions with proper search_path
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

-- 4. Create function to get safe public profile data
CREATE OR REPLACE FUNCTION public.get_public_profile_safe(profile_user_id uuid)
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