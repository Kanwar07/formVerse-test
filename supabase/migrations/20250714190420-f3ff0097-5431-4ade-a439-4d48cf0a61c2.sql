-- Create enum types for better data validation
CREATE TYPE cad_software AS ENUM (
  'solidworks', 'autocad', 'fusion360', 'inventor', 'catia', 'creo', 
  'rhino', 'sketchup', 'blender', 'onshape', 'freecad', 'tinkercad', 'other'
);

CREATE TYPE proficiency_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

CREATE TYPE industry_focus AS ENUM (
  'mechanical_engineering', 'automotive', 'aerospace', 'architecture', 
  'product_design', 'medical_devices', 'electronics', 'jewelry_design', 
  'toys_games', 'industrial_equipment', 'consumer_products', 'other'
);

CREATE TYPE design_category AS ENUM (
  'functional_parts', 'decorative_items', 'prototypes', 'replacement_parts', 
  'custom_components', 'assemblies', 'tools_fixtures'
);

CREATE TYPE manufacturing_process AS ENUM (
  'fdm_fff', 'sla_resin', 'sls', 'metal_printing', 'multi_material', 
  'cnc_machining', 'injection_molding', 'sheet_metal', 'casting_forging', 'other'
);

CREATE TYPE creator_role AS ENUM (
  'professional_designer', 'freelancer', 'student', 'hobbyist', 'entrepreneur', 'other'
);

-- Create the creator onboarding table
CREATE TABLE public.creator_onboarding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- CAD Software Proficiency
  cad_software_skills JSONB DEFAULT '[]'::jsonb, -- Array of {software: cad_software, proficiency: proficiency_level, years_experience: number, certified: boolean}
  
  -- Design Specializations
  industry_focus industry_focus[] DEFAULT '{}',
  design_categories design_category[] DEFAULT '{}',
  
  -- Technical Capabilities
  file_formats TEXT[] DEFAULT '{}', -- Supported file formats
  design_complexity_level TEXT[] DEFAULT '{}', -- What complexity they can handle
  
  -- Manufacturing Knowledge
  manufacturing_processes manufacturing_process[] DEFAULT '{}',
  printing_experience JSONB DEFAULT '{}'::jsonb, -- Details about 3D printing experience
  
  -- Professional Background
  user_role creator_role NOT NULL,
  total_experience_years INTEGER DEFAULT 0,
  team_collaboration_experience BOOLEAN DEFAULT false,
  commercial_project_experience BOOLEAN DEFAULT false,
  
  -- Quality & Standards Knowledge
  quality_control_knowledge TEXT[] DEFAULT '{}', -- DFM, DFA, GD&T, etc.
  standards_compliance TEXT[] DEFAULT '{}', -- ISO, ANSI, etc.
  
  -- Portfolio
  portfolio_samples JSONB DEFAULT '[]'::jsonb, -- Array of {file_path: string, description: string, design_process: string}
  
  -- Business Readiness
  ip_understanding_level INTEGER DEFAULT 1 CHECK (ip_understanding_level >= 1 AND ip_understanding_level <= 5),
  pricing_strategy_experience BOOLEAN DEFAULT false,
  customer_service_approach TEXT,
  revision_willingness INTEGER DEFAULT 1 CHECK (revision_willingness >= 1 AND revision_willingness <= 5),
  
  -- Software Ecosystem
  rendering_software TEXT[] DEFAULT '{}',
  simulation_tools TEXT[] DEFAULT '{}',
  collaboration_platforms TEXT[] DEFAULT '{}',
  
  -- Goals & Expectations
  primary_goals TEXT[] DEFAULT '{}',
  expected_upload_frequency TEXT,
  target_audience TEXT[] DEFAULT '{}',
  revenue_expectations TEXT,
  
  -- Metadata
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.creator_onboarding ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own onboarding data" 
ON public.creator_onboarding 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding data" 
ON public.creator_onboarding 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding data" 
ON public.creator_onboarding 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_creator_onboarding_updated_at
BEFORE UPDATE ON public.creator_onboarding
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for performance
CREATE INDEX idx_creator_onboarding_user_id ON public.creator_onboarding(user_id);
CREATE INDEX idx_creator_onboarding_completed ON public.creator_onboarding(onboarding_completed);