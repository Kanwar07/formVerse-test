-- Add missing model_analytics table for tracking downloads
CREATE TABLE IF NOT EXISTS public.model_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  user_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on model_analytics
ALTER TABLE public.model_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for model_analytics
CREATE POLICY "Anyone can insert analytics events" 
ON public.model_analytics 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Model owners can view analytics for their models" 
ON public.model_analytics 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.models 
  WHERE models.id = model_analytics.model_id 
  AND models.user_id = auth.uid()
));

-- Add index for performance
CREATE INDEX idx_model_analytics_model_id ON public.model_analytics(model_id);
CREATE INDEX idx_model_analytics_event_type ON public.model_analytics(event_type);

-- Insert model licenses for existing models (using Personal license type for now)
INSERT INTO public.model_licenses (model_id, license_type_id, price, is_active)
SELECT 
  m.id,
  'e3fb40c4-51a7-42d2-b768-5c60be04d0de'::uuid, -- Personal license type ID
  0, -- Free for personal use
  true
FROM public.models m
WHERE NOT EXISTS (
  SELECT 1 FROM public.model_licenses ml 
  WHERE ml.model_id = m.id
);

-- Also add commercial licenses for existing models
INSERT INTO public.model_licenses (model_id, license_type_id, price, is_active)
SELECT 
  m.id,
  '8bc4e786-456c-467c-b468-8bb42d9ed44a'::uuid, -- Commercial license type ID
  29.99, -- Commercial price
  true
FROM public.models m
WHERE NOT EXISTS (
  SELECT 1 FROM public.model_licenses ml 
  WHERE ml.model_id = m.id 
  AND ml.license_type_id = '8bc4e786-456c-467c-b468-8bb42d9ed44a'::uuid
);