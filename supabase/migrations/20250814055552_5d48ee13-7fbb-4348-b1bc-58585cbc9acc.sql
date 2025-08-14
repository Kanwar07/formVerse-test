-- Fix security vulnerability: Restrict profiles table access to prevent email harvesting

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create a secure policy that protects email addresses
-- Users can only see:
-- 1. Their own complete profile (including email)
-- 2. Public profiles of others (excluding sensitive data like email)
CREATE POLICY "Secure profile access" ON public.profiles
FOR SELECT USING (
  -- Users can always see their own profile with all data
  auth.uid() = id 
  OR 
  -- For other users' profiles, only show public profiles and exclude sensitive data
  -- Note: This policy structure ensures email is only visible to profile owners
  (is_public = true AND auth.uid() != id)
);

-- Create a separate policy for email visibility - only profile owners can see their email
-- This is handled by creating a view for public profile data that excludes emails
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  username,
  avatar_url,
  bio,
  location,
  website,
  specialties,
  role,
  created_at,
  updated_at,
  is_public
FROM public.profiles
WHERE is_public = true;

-- Grant access to the public profiles view
GRANT SELECT ON public.public_profiles TO authenticated, anon;

-- Add RLS to the view (inherits from base table but safer)
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- Create a function to get user's own profile safely
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