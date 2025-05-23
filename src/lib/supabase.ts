
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

// Profile helper functions
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { profile: data, error };
};

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  return { data, error };
};

// Model helper functions
export const uploadModel = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${crypto.randomUUID()}.${fileExt}`;
  const filePath = `models/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('3d-models')
    .upload(filePath, file);
    
  return { path: data?.path, error };
};

export const createModelRecord = async (modelData: {
  name: string;
  description: string;
  file_path: string;
  preview_image?: string;
  tags: string[];
  price: number;
  printability_score: number;
  user_id: string;
}) => {
  const { data, error } = await supabase
    .from('models')
    .insert(modelData)
    .select()
    .single();
  
  return { model: data, error };
};

export const getModels = async () => {
  const { data, error } = await supabase
    .from('models')
    .select('*, profiles(*)');
  
  return { models: data, error };
};

export const getModelById = async (modelId: string) => {
  const { data, error } = await supabase
    .from('models')
    .select('*, profiles(*)')
    .eq('id', modelId)
    .single();
  
  return { model: data, error };
};

export const getUserModels = async (userId: string) => {
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .eq('user_id', userId);
  
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
  const { data, error } = await supabase
    .from('formiq_analyses')
    .select('*')
    .eq('model_id', modelId)
    .single();
  
  return { analysis: data, error };
};

// File upload helpers
export const uploadThumbnail = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${crypto.randomUUID()}.${fileExt}`;
  const filePath = `thumbnails/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('model-images')
    .upload(filePath, file);
    
  return { path: data?.path, error };
};

export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};
