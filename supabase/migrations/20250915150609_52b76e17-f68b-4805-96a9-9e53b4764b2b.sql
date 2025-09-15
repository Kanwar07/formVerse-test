-- Allow public access to profiles of creators who have published models
CREATE POLICY "Public profiles for creators with published models"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.models
    WHERE models.user_id = profiles.id
    AND models.status = 'published'
    AND models.is_published = true
  )
);