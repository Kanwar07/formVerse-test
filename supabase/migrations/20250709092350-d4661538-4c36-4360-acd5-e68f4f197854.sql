-- Add quality status tracking to models table
ALTER TABLE public.models 
ADD COLUMN quality_status text DEFAULT 'pending'::text,
ADD COLUMN quality_checked_at timestamp with time zone,
ADD COLUMN quality_notes text;

-- Add check constraint for quality status values
ALTER TABLE public.models 
ADD CONSTRAINT models_quality_status_check 
CHECK (quality_status IN ('pending', 'approved', 'declined', 'reviewing'));

-- Create index for quality status queries
CREATE INDEX idx_models_quality_status ON public.models(quality_status);

-- Update RLS policy to only show approved models to public
DROP POLICY IF EXISTS "Anyone can view published models" ON public.models;

CREATE POLICY "Anyone can view approved published models" 
ON public.models 
FOR SELECT 
USING (status = 'published'::text AND quality_status = 'approved'::text);

-- Allow creators to see their own models regardless of quality status
CREATE POLICY "Creators can view their own models" 
ON public.models 
FOR SELECT 
USING (auth.uid() = user_id);