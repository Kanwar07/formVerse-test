
-- Update existing users table structure via profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'buyer' CHECK (role IN ('creator', 'buyer', 'admin'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS razorpay_customer_id text;

-- Enhanced models table for comprehensive CAD management
ALTER TABLE models ADD COLUMN IF NOT EXISTS file_hash text UNIQUE;
ALTER TABLE models ADD COLUMN IF NOT EXISTS file_format text;
ALTER TABLE models ADD COLUMN IF NOT EXISTS file_size_mb decimal(10,2);
ALTER TABLE models ADD COLUMN IF NOT EXISTS geometry_data jsonb DEFAULT '{}';
ALTER TABLE models ADD COLUMN IF NOT EXISTS is_reported boolean DEFAULT false;
ALTER TABLE models ADD COLUMN IF NOT EXISTS report_count integer DEFAULT 0;
ALTER TABLE models ADD COLUMN IF NOT EXISTS admin_status text DEFAULT 'approved' CHECK (admin_status IN ('pending', 'approved', 'rejected'));

-- Create comprehensive licensing system
CREATE TABLE IF NOT EXISTS license_types (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  is_exclusive boolean DEFAULT false,
  allows_commercial boolean DEFAULT true,
  max_downloads integer, -- NULL means unlimited
  duration_days integer, -- NULL means lifetime
  created_at timestamp with time zone DEFAULT now()
);

-- Insert default license types
INSERT INTO license_types (name, description, is_exclusive, allows_commercial, max_downloads, duration_days)
VALUES 
  ('Personal', 'Personal use only, non-commercial', false, false, NULL, NULL),
  ('Commercial', 'Commercial use allowed', false, true, NULL, NULL),
  ('Exclusive', 'Exclusive rights, revokes other licenses', true, true, NULL, NULL)
ON CONFLICT (name) DO NOTHING;

-- Create model licenses table
CREATE TABLE IF NOT EXISTS model_licenses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id uuid REFERENCES models(id) ON DELETE CASCADE NOT NULL,
  license_type_id uuid REFERENCES license_types(id) NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(model_id, license_type_id)
);

-- Create user licenses (purchased licenses)
CREATE TABLE IF NOT EXISTS user_licenses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  model_id uuid REFERENCES models(id) ON DELETE CASCADE NOT NULL,
  license_type_id uuid REFERENCES license_types(id) NOT NULL,
  transaction_id uuid,
  download_count integer DEFAULT 0,
  is_revoked boolean DEFAULT false,
  expires_at timestamp with time zone,
  purchased_at timestamp with time zone DEFAULT now(),
  revoked_at timestamp with time zone,
  revocation_reason text
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  model_id uuid REFERENCES models(id) NOT NULL,
  license_type_id uuid REFERENCES license_types(id) NOT NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  payment_method text, -- 'razorpay', 'paypal', 'stripe'
  payment_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone
);

-- Create downloads tracking table
CREATE TABLE IF NOT EXISTS model_downloads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  model_id uuid REFERENCES models(id) ON DELETE CASCADE NOT NULL,
  license_id uuid REFERENCES user_licenses(id) NOT NULL,
  download_token text UNIQUE,
  ip_address inet,
  user_agent text,
  expires_at timestamp with time zone,
  downloaded_at timestamp with time zone DEFAULT now()
);

-- Create reports table for content moderation
CREATE TABLE IF NOT EXISTS model_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id uuid REFERENCES models(id) ON DELETE CASCADE NOT NULL,
  reporter_id uuid NOT NULL,
  reason text NOT NULL,
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_notes text,
  created_at timestamp with time zone DEFAULT now(),
  resolved_at timestamp with time zone
);

-- Create FormIQ integration tracking
CREATE TABLE IF NOT EXISTS formiq_jobs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id uuid REFERENCES models(id) ON DELETE CASCADE NOT NULL,
  job_status text DEFAULT 'pending' CHECK (job_status IN ('pending', 'processing', 'completed', 'failed')),
  formiq_job_id text,
  result_data jsonb DEFAULT '{}',
  error_message text,
  created_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone
);

-- Create admin activity log
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid NOT NULL,
  action text NOT NULL,
  target_type text, -- 'model', 'user', 'license', 'transaction'
  target_id uuid,
  details jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE license_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE formiq_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for license_types (public read)
CREATE POLICY "Anyone can view license types" ON license_types FOR SELECT USING (true);

-- RLS Policies for model_licenses
CREATE POLICY "Anyone can view active model licenses" ON model_licenses 
  FOR SELECT USING (is_active = true);
CREATE POLICY "Creators can manage their model licenses" ON model_licenses 
  FOR ALL USING (EXISTS (
    SELECT 1 FROM models WHERE models.id = model_licenses.model_id AND models.user_id = auth.uid()
  ));

-- RLS Policies for user_licenses  
CREATE POLICY "Users can view their own licenses" ON user_licenses 
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can create user licenses" ON user_licenses 
  FOR INSERT WITH CHECK (true);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" ON transactions 
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can create transactions" ON transactions 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update transactions" ON transactions 
  FOR UPDATE USING (true);

-- RLS Policies for model_downloads
CREATE POLICY "Users can view their own downloads" ON model_downloads 
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can create download records" ON model_downloads 
  FOR INSERT WITH CHECK (true);

-- RLS Policies for model_reports
CREATE POLICY "Users can view their own reports" ON model_reports 
  FOR SELECT USING (reporter_id = auth.uid());
CREATE POLICY "Users can create reports" ON model_reports 
  FOR INSERT WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "Admins can view all reports" ON model_reports 
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- RLS Policies for formiq_jobs
CREATE POLICY "Creators can view FormIQ jobs for their models" ON formiq_jobs 
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM models WHERE models.id = formiq_jobs.model_id AND models.user_id = auth.uid()
  ));

-- RLS Policies for admin_logs (admin only)
CREATE POLICY "Admins can view admin logs" ON admin_logs 
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));
CREATE POLICY "Admins can create admin logs" ON admin_logs 
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_licenses_user_model ON user_licenses(user_id, model_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_model_downloads_token ON model_downloads(download_token);
CREATE INDEX IF NOT EXISTS idx_model_reports_status ON model_reports(status);
CREATE INDEX IF NOT EXISTS idx_formiq_jobs_status ON formiq_jobs(job_status);
CREATE INDEX IF NOT EXISTS idx_models_file_hash ON models(file_hash);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Create functions for license management
CREATE OR REPLACE FUNCTION revoke_existing_licenses(target_model_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE user_licenses 
  SET is_revoked = true, 
      revoked_at = now(), 
      revocation_reason = 'Exclusive license purchased'
  WHERE model_id = target_model_id 
    AND is_revoked = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to generate download tokens
CREATE OR REPLACE FUNCTION generate_download_token(user_id_param uuid, model_id_param uuid, license_id_param uuid)
RETURNS text AS $$
DECLARE
  token text;
BEGIN
  token := encode(gen_random_bytes(32), 'hex');
  
  INSERT INTO model_downloads (user_id, model_id, license_id, download_token, expires_at)
  VALUES (user_id_param, model_id_param, license_id_param, token, now() + interval '1 hour');
  
  RETURN token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create materialized view for sales analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS sales_analytics AS
SELECT 
  DATE(t.completed_at) as sale_date,
  COUNT(*) as total_sales,
  SUM(t.amount) as total_revenue,
  COUNT(DISTINCT t.user_id) as unique_buyers,
  COUNT(DISTINCT t.model_id) as unique_models,
  AVG(t.amount) as avg_sale_amount
FROM transactions t
WHERE t.status = 'completed'
  AND t.completed_at IS NOT NULL
GROUP BY DATE(t.completed_at)
ORDER BY sale_date DESC;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_sales_analytics_date ON sales_analytics(sale_date);
