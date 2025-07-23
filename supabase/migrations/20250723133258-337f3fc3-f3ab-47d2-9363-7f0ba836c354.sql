-- Add is_published column to models table
ALTER TABLE public.models 
ADD COLUMN is_published BOOLEAN DEFAULT FALSE;

-- Create index for better performance on marketplace queries
CREATE INDEX idx_models_is_published ON public.models(is_published);

-- Update the existing RLS policy to include is_published check
DROP POLICY IF EXISTS "Anyone can view approved published models" ON public.models;

CREATE POLICY "Anyone can view approved published models" 
ON public.models 
FOR SELECT 
USING (status = 'published'::text AND quality_status = 'approved'::text AND is_published = TRUE);