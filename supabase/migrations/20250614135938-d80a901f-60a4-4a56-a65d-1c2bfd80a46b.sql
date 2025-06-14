
-- Create storage bucket for model thumbnails/images
INSERT INTO storage.buckets (id, name, public)
VALUES ('model-images', 'model-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for model images
CREATE POLICY "Anyone can view model images" ON storage.objects
FOR SELECT USING (bucket_id = 'model-images');

CREATE POLICY "Users can upload model images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'model-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their model images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'model-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  specialties TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    LOWER(SPLIT_PART(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update models table to include status and publication info
ALTER TABLE public.models 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published',
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS difficulty_level TEXT;

-- Update RLS policies for models to ensure proper access
DROP POLICY IF EXISTS "Anyone can view published models" ON public.models;
DROP POLICY IF EXISTS "Users can insert their own models" ON public.models;
DROP POLICY IF EXISTS "Users can update their own models" ON public.models;
DROP POLICY IF EXISTS "Users can delete their own models" ON public.models;

CREATE POLICY "Anyone can view published models" ON public.models
FOR SELECT USING (status = 'published');

CREATE POLICY "Users can insert their own models" ON public.models
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own models" ON public.models
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own models" ON public.models
FOR DELETE USING (auth.uid() = user_id);

-- Update formiq_analyses RLS policies
DROP POLICY IF EXISTS "Anyone can view analyses" ON public.formiq_analyses;
DROP POLICY IF EXISTS "Users can insert analyses for their models" ON public.formiq_analyses;

CREATE POLICY "Anyone can view analyses" ON public.formiq_analyses
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.models 
    WHERE models.id = formiq_analyses.model_id 
    AND models.status = 'published'
  )
);

CREATE POLICY "Users can insert analyses for their models" ON public.formiq_analyses
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.models 
    WHERE models.id = formiq_analyses.model_id 
    AND models.user_id = auth.uid()
  )
);
