-- Create table for tracking VFusion3D conversion jobs
CREATE TABLE public.vfusion3d_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prediction_id TEXT NOT NULL UNIQUE,
  user_id UUID,
  image_url TEXT NOT NULL,
  result_url TEXT,
  status TEXT NOT NULL DEFAULT 'processing',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vfusion3d_jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own vfusion3d jobs" 
ON public.vfusion3d_jobs 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create vfusion3d jobs" 
ON public.vfusion3d_jobs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own vfusion3d jobs" 
ON public.vfusion3d_jobs 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_vfusion3d_jobs_updated_at
BEFORE UPDATE ON public.vfusion3d_jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_vfusion3d_jobs_prediction_id ON public.vfusion3d_jobs(prediction_id);
CREATE INDEX idx_vfusion3d_jobs_user_id ON public.vfusion3d_jobs(user_id);
CREATE INDEX idx_vfusion3d_jobs_status ON public.vfusion3d_jobs(status);