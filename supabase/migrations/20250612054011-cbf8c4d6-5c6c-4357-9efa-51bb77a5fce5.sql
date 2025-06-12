
-- First, let's ensure the storage bucket exists and is properly configured
INSERT INTO storage.buckets (id, name, public)
VALUES ('3d-models', '3d-models', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can upload their own models" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view models" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own models" ON storage.objects;

-- Create proper storage policies with correct path structure
CREATE POLICY "Users can upload their own models" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = '3d-models' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view models" ON storage.objects
FOR SELECT USING (bucket_id = '3d-models');

CREATE POLICY "Users can delete their own models" ON storage.objects
FOR DELETE USING (
  bucket_id = '3d-models' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Also ensure the models table RLS policies are correct
DROP POLICY IF EXISTS "Anyone can view published models" ON public.models;
DROP POLICY IF EXISTS "Users can insert their own models" ON public.models;
DROP POLICY IF EXISTS "Users can update their own models" ON public.models;
DROP POLICY IF EXISTS "Users can delete their own models" ON public.models;

CREATE POLICY "Anyone can view published models" ON public.models
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own models" ON public.models
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own models" ON public.models
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own models" ON public.models
FOR DELETE USING (auth.uid() = user_id);

-- Ensure RLS is enabled on both tables
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

-- Also fix the formiq_analyses table policies
DROP POLICY IF EXISTS "Anyone can view analyses" ON public.formiq_analyses;
DROP POLICY IF EXISTS "System can insert analyses" ON public.formiq_analyses;

CREATE POLICY "Anyone can view analyses" ON public.formiq_analyses
FOR SELECT USING (true);

CREATE POLICY "Users can insert analyses for their models" ON public.formiq_analyses
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.models 
    WHERE models.id = formiq_analyses.model_id 
    AND models.user_id = auth.uid()
  )
);

ALTER TABLE public.formiq_analyses ENABLE ROW LEVEL SECURITY;
