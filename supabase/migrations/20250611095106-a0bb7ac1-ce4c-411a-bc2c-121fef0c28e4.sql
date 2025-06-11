
-- Create storage bucket for 3D models
INSERT INTO storage.buckets (id, name, public)
VALUES ('3d-models', '3d-models', true);

-- Create storage policy to allow authenticated users to upload their own files
CREATE POLICY "Users can upload their own models" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = '3d-models' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create storage policy to allow users to view all models
CREATE POLICY "Anyone can view models" ON storage.objects
FOR SELECT USING (bucket_id = '3d-models');

-- Create storage policy to allow users to delete their own models
CREATE POLICY "Users can delete their own models" ON storage.objects
FOR DELETE USING (
  bucket_id = '3d-models' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create models table to store model metadata
CREATE TABLE public.models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  preview_image TEXT,
  tags TEXT[] DEFAULT '{}',
  price DECIMAL(10,2),
  license_type TEXT,
  printability_score INTEGER,
  material_recommendations TEXT[] DEFAULT '{}',
  printing_techniques TEXT[] DEFAULT '{}',
  design_issues JSONB DEFAULT '[]',
  oem_compatibility JSONB DEFAULT '[]',
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on models table
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

-- Create policies for models table
CREATE POLICY "Anyone can view published models" ON public.models
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own models" ON public.models
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own models" ON public.models
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own models" ON public.models
FOR DELETE USING (auth.uid() = user_id);

-- Create FormIQ analyses table
CREATE TABLE public.formiq_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id UUID REFERENCES public.models(id) ON DELETE CASCADE,
  printability_score INTEGER NOT NULL,
  material_recommendations TEXT[] DEFAULT '{}',
  printing_techniques TEXT[] DEFAULT '{}',
  design_issues JSONB DEFAULT '[]',
  oem_compatibility JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on formiq_analyses table
ALTER TABLE public.formiq_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies for formiq_analyses table
CREATE POLICY "Anyone can view analyses" ON public.formiq_analyses
FOR SELECT USING (true);

CREATE POLICY "System can insert analyses" ON public.formiq_analyses
FOR INSERT WITH CHECK (true);
