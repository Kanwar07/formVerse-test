-- Create storage policies for the model-images bucket to allow VFusion3D uploads

-- Policy to allow users to upload images for VFusion3D conversion
CREATE POLICY "Users can upload images for VFusion3D conversion" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'model-images' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = 'vfusion3d-inputs'
);

-- Policy to allow users to view images they uploaded for VFusion3D
CREATE POLICY "Users can view VFusion3D input images" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'model-images' 
  AND (storage.foldername(name))[1] = 'vfusion3d-inputs'
);

-- Policy to allow public access to VFusion3D generated results
CREATE POLICY "Public access to VFusion3D results" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'model-images' 
  AND (storage.foldername(name))[1] = 'vfusion3d-results'
);

-- Policy to allow system to upload VFusion3D results
CREATE POLICY "System can upload VFusion3D results" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'model-images' 
  AND (storage.foldername(name))[1] = 'vfusion3d-results'
);