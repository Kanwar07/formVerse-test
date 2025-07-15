-- Create a test user license for trial download
-- Note: Using a dummy user ID for demonstration
INSERT INTO public.user_licenses (
  user_id, 
  model_id, 
  license_type_id,
  download_count,
  is_revoked,
  purchased_at
) VALUES (
  '264ee73c-71a5-401c-a4e1-efa648a3028b'::uuid, -- Test user ID from network logs
  'b2d4865d-041e-40c1-800e-4ae1eb5f8818'::uuid, -- MAIN CLOUSER PTS model ID
  'e3fb40c4-51a7-42d2-b768-5c60be04d0de'::uuid, -- Personal license type
  0,
  false,
  now()
) ON CONFLICT DO NOTHING;