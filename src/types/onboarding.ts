export interface CADSoftwareSkill {
  software: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years_experience: number;
  certified: boolean;
}

export interface PortfolioSample {
  file_path: string;
  description: string;
  design_process: string;
}

export interface CreatorOnboardingData {
  // CAD Software Proficiency
  cad_software_skills: CADSoftwareSkill[];
  
  // Design Specializations
  industry_focus: string[];
  design_categories: string[];
  
  // Technical Capabilities
  file_formats: string[];
  design_complexity_level: string[];
  
  // Manufacturing Knowledge
  manufacturing_processes: string[];
  printing_experience: Record<string, any>;
  
  // Professional Background
  user_role: 'professional_designer' | 'freelancer' | 'student' | 'hobbyist' | 'entrepreneur' | 'other';
  total_experience_years: number;
  team_collaboration_experience: boolean;
  commercial_project_experience: boolean;
  
  // Quality & Standards Knowledge
  quality_control_knowledge: string[];
  standards_compliance: string[];
  
  // Portfolio
  portfolio_samples: PortfolioSample[];
  
  // Business Readiness
  ip_understanding_level: number;
  pricing_strategy_experience: boolean;
  customer_service_approach: string;
  revision_willingness: number;
  
  // Software Ecosystem
  rendering_software: string[];
  simulation_tools: string[];
  collaboration_platforms: string[];
  
  // Goals & Expectations
  primary_goals: string[];
  expected_upload_frequency: string;
  target_audience: string[];
  revenue_expectations: string;
  
  // Metadata
  onboarding_step: number;
  onboarding_completed: boolean;
}

export const CAD_SOFTWARE_OPTIONS = [
  { value: 'solidworks', label: 'SolidWorks' },
  { value: 'autocad', label: 'AutoCAD' },
  { value: 'fusion360', label: 'Fusion 360' },
  { value: 'inventor', label: 'Inventor' },
  { value: 'catia', label: 'CATIA' },
  { value: 'creo', label: 'Creo/Pro-E' },
  { value: 'rhino', label: 'Rhino' },
  { value: 'sketchup', label: 'SketchUp' },
  { value: 'blender', label: 'Blender' },
  { value: 'onshape', label: 'OnShape' },
  { value: 'freecad', label: 'FreeCAD' },
  { value: 'tinkercad', label: 'Tinkercad' },
  { value: 'other', label: 'Other' }
];

export const PROFICIENCY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
];

export const INDUSTRY_FOCUS_OPTIONS = [
  { value: 'mechanical_engineering', label: 'Mechanical Engineering' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'aerospace', label: 'Aerospace' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'product_design', label: 'Product Design' },
  { value: 'medical_devices', label: 'Medical Devices' },
  { value: 'electronics', label: 'Electronics/PCB' },
  { value: 'jewelry_design', label: 'Jewelry Design' },
  { value: 'toys_games', label: 'Toys & Games' },
  { value: 'industrial_equipment', label: 'Industrial Equipment' },
  { value: 'consumer_products', label: 'Consumer Products' },
  { value: 'other', label: 'Other' }
];

export const DESIGN_CATEGORIES = [
  { value: 'functional_parts', label: 'Functional Parts' },
  { value: 'decorative_items', label: 'Decorative Items' },
  { value: 'prototypes', label: 'Prototypes' },
  { value: 'replacement_parts', label: 'Replacement Parts' },
  { value: 'custom_components', label: 'Custom Components' },
  { value: 'assemblies', label: 'Assemblies' },
  { value: 'tools_fixtures', label: 'Tools & Fixtures' }
];

export const MANUFACTURING_PROCESSES = [
  { value: 'fdm_fff', label: 'FDM/FFF' },
  { value: 'sla_resin', label: 'SLA/Resin' },
  { value: 'sls', label: 'SLS' },
  { value: 'metal_printing', label: 'Metal Printing' },
  { value: 'multi_material', label: 'Multi-material Printing' },
  { value: 'cnc_machining', label: 'CNC Machining' },
  { value: 'injection_molding', label: 'Injection Molding' },
  { value: 'sheet_metal', label: 'Sheet Metal' },
  { value: 'casting_forging', label: 'Casting/Forging' },
  { value: 'other', label: 'Other' }
];

export const CREATOR_ROLES = [
  { value: 'professional_designer', label: 'Professional Designer/Engineer' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'student', label: 'Student' },
  { value: 'hobbyist', label: 'Hobbyist' },
  { value: 'entrepreneur', label: 'Entrepreneur' },
  { value: 'other', label: 'Other' }
];

export const FILE_FORMATS = [
  'STEP', 'IGES', 'STL', 'OBJ', 'SLDPRT', 'DWG', 'IPT', '3MF', 'PLY', 'X3D', 'VRML', 'Other'
];

export const DESIGN_COMPLEXITY_LEVELS = [
  'Simple geometric shapes',
  'Complex assemblies',
  'Parametric designs',
  'Surface modeling',
  'Organic/freeform designs'
];

export const QUALITY_CONTROL_KNOWLEDGE = [
  'Design for Manufacturing (DFM)',
  'Design for Assembly (DFA)',
  'GD&T (Geometric Dimensioning & Tolerancing)',
  'Material selection',
  'Standards compliance'
];

export const STANDARDS_COMPLIANCE = [
  'ISO standards',
  'ANSI standards',
  'DIN standards',
  'JIS standards',
  'Industry-specific standards'
];

export const RENDERING_SOFTWARE = [
  'KeyShot',
  'V-Ray',
  'Solidworks Photoview 360',
  'Fusion 360 Render',
  'Blender Cycles',
  'Cinema 4D',
  'Other'
];

export const SIMULATION_TOOLS = [
  'FEA (Finite Element Analysis)',
  'CFD (Computational Fluid Dynamics)',
  'Motion Analysis',
  'Thermal Analysis',
  'Structural Analysis',
  'Other'
];

export const COLLABORATION_PLATFORMS = [
  'PLM Systems',
  'PDM Systems',
  'GitHub',
  'OnShape Teams',
  'Fusion 360 Teams',
  'Other'
];

export const PRIMARY_GOALS = [
  'Generate passive income',
  'Build professional portfolio',
  'Share designs with community',
  'Monetize existing designs',
  'Establish design business',
  'Learn from other creators'
];

export const UPLOAD_FREQUENCY = [
  'Daily',
  'Weekly',
  'Monthly',
  'Quarterly',
  'As needed'
];

export const TARGET_AUDIENCE = [
  'Engineers',
  'Hobbyists',
  'Students',
  'Businesses',
  'Manufacturers',
  'Other creators'
];

export const REVENUE_EXPECTATIONS = [
  'Less than $100/month',
  '$100-$500/month',
  '$500-$1,000/month',
  '$1,000-$5,000/month',
  'More than $5,000/month'
];