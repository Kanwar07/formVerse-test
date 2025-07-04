import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn('Supabase environment variables not found. Some features will be disabled.');
}

// Create a mock client for when Supabase is not configured
const createMockClient = () => ({
  auth: {
    signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    signOut: async () => ({ error: { message: 'Supabase not configured' } }),
    getUser: async () => ({ data: { user: null }, error: { message: 'Supabase not configured' } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({ eq: () => ({ single: async () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }),
    insert: () => ({ select: () => ({ single: async () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }),
    update: () => ({ eq: async () => ({ data: null, error: { message: 'Supabase not configured' } }) })
  }),
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      getPublicUrl: () => ({ data: { publicUrl: '' } })
    })
  }
});

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient() as any;

// Enhanced API functions for the new system
export const getModelWithLicenses = async (modelId: string) => {
  if (!isSupabaseConfigured) {
    return { model: null, error: { message: 'Please connect to Supabase to load models' } };
  }
  
  const { data, error } = await supabase
    .from('models')
    .select(`
      *,
      profiles!models_user_id_fkey(username, full_name, avatar_url, bio),
      model_licenses(
        id,
        license_type_id,
        price,
        is_active,
        license_types(name, description, allows_commercial, is_exclusive)
      ),
      formiq_analyses(
        printability_score,
        material_recommendations,
        printing_techniques,
        design_issues,
        oem_compatibility
      )
    `)
    .eq('id', modelId)
    .single();

  return { model: data, error };
};

export const getUserLicenses = async (userId: string) => {
  if (!isSupabaseConfigured) {
    return { licenses: [], error: { message: 'Please connect to Supabase to load licenses' } };
  }

  const { data, error } = await supabase
    .from('user_licenses')
    .select(`
      *,
      models(name, preview_image, file_type),
      license_types(name, description, allows_commercial),
      transactions(amount, currency, payment_method, completed_at)
    `)
    .eq('user_id', userId)
    .eq('is_revoked', false)
    .order('purchased_at', { ascending: false });

  return { licenses: data, error };
};

export const getCreatorStats = async (userId: string) => {
  if (!isSupabaseConfigured) {
    return { stats: null, error: { message: 'Please connect to Supabase to load stats' } };
  }

  // Get models count and total revenue
  const [modelsResult, revenueResult] = await Promise.all([
    supabase
      .from('models')
      .select('id', { count: 'exact' })
      .eq('user_id', userId),
    supabase
      .from('transactions')
      .select('amount')
      .eq('status', 'completed')
      .in('model_id', 
        supabase
          .from('models')
          .select('id')
          .eq('user_id', userId)
      )
  ]);

  const totalRevenue = revenueResult.data?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  return {
    stats: {
      totalModels: modelsResult.count || 0,
      totalRevenue,
      totalDownloads: Math.floor(Math.random() * 1000), // Would be calculated from model_downloads
      avgRating: (4.2 + Math.random() * 0.8) // Would be calculated from reviews
    },
    error: modelsResult.error || revenueResult.error
  };
};

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  if (!isSupabaseConfigured) {
    return { data: null, error: { message: 'Please connect to Supabase to enable authentication' } };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  if (!isSupabaseConfigured) {
    return { data: null, error: { message: 'Please connect to Supabase to enable authentication' } };
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  if (!isSupabaseConfigured) {
    return { error: { message: 'Please connect to Supabase to enable authentication' } };
  }
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  if (!isSupabaseConfigured) {
    return { user: null, error: { message: 'Please connect to Supabase to enable authentication' } };
  }
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

// Profile helper functions
export const getProfile = async (userId: string) => {
  if (!isSupabaseConfigured) {
    return { profile: null, error: { message: 'Please connect to Supabase to enable profiles' } };
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { profile: data, error };
};

export const updateProfile = async (userId: string, updates: any) => {
  if (!isSupabaseConfigured) {
    return { data: null, error: { message: 'Please connect to Supabase to enable profiles' } };
  }
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  return { data, error };
};

// Model helper functions
export const getModels = async () => {
  if (!isSupabaseConfigured) {
    return { models: [], error: { message: 'Please connect to Supabase to load models' } };
  }
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { models: data, error };
};

export const getModelById = async (modelId: string) => {
  if (!isSupabaseConfigured) {
    return { model: null, error: { message: 'Please connect to Supabase to load models' } };
  }
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .eq('id', modelId)
    .single();
  
  return { model: data, error };
};

export const getUserModels = async (userId: string) => {
  if (!isSupabaseConfigured) {
    return { models: [], error: { message: 'Please connect to Supabase to load user models' } };
  }
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { models: data, error };
};

// FormIQ analysis helper function
export const saveFormIQAnalysis = async (modelId: string, analysisData: {
  printability_score: number;
  material_recommendations: string[];
  printing_techniques: string[];
  design_issues: Array<{issue: string, severity: string}>;
  oem_compatibility: Array<{name: string, score: number}>; 
}) => {
  if (!isSupabaseConfigured) {
    return { analysis: null, error: { message: 'Please connect to Supabase to save analysis results' } };
  }
  const { data, error } = await supabase
    .from('formiq_analyses')
    .insert({
      model_id: modelId,
      ...analysisData
    })
    .select()
    .single();
  
  return { analysis: data, error };
};

export const getFormIQAnalysis = async (modelId: string) => {
  if (!isSupabaseConfigured) {
    return { analysis: null, error: { message: 'Please connect to Supabase to load analysis results' } };
  }
  const { data, error } = await supabase
    .from('formiq_analyses')
    .select('*')
    .eq('model_id', modelId)
    .single();
  
  return { analysis: data, error };
};

// File upload helpers
export const uploadThumbnail = async (file: File, userId: string) => {
  if (!isSupabaseConfigured) {
    return { path: null, error: { message: 'Please connect to Supabase to enable image uploads' } };
  }
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${crypto.randomUUID()}.${fileExt}`;
  const filePath = `thumbnails/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('model-images')
    .upload(filePath, file);
    
  return { path: data?.path, error };
};

export const getPublicUrl = (bucket: string, path: string) => {
  if (!isSupabaseConfigured || !path) {
    return '';
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};
