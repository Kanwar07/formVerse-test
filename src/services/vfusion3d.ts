import { supabase } from '@/integrations/supabase/client';

export interface VFusion3DJob {
  id: string;
  prediction_id: string;
  user_id?: string;
  image_url: string;
  result_url?: string;
  status: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface VFusion3DResponse {
  predictionId: string;
  status: string;
  message?: string;
  output?: any;
  error?: string;
}

export class VFusion3DService {
  
  /**
   * Upload image to Supabase storage and start VFusion3D conversion
   */
  static async convertImageTo3D(imageFile: File, userId?: string): Promise<VFusion3DResponse> {
    try {
      // First upload the image to Supabase storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `vfusion3d-inputs/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('model-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('model-images')
        .getPublicUrl(filePath);

      // Call the TripoSR edge function for 3D conversion
      const { data, error } = await supabase.functions.invoke('vfusion3d-convert', {
        body: {
          imageUrl: publicUrl,
          userId: userId
        }
      });

      if (error) {
        throw new Error(`TripoSR conversion failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in convertImageTo3D:', error);
      throw error;
    }
  }

  /**
   * Check the status of a VFusion3D conversion job
   */
  static async checkJobStatus(predictionId: string): Promise<VFusion3DResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('vfusion3d-convert', {
        body: {
          predictionId: predictionId
        }
      });

      if (error) {
        throw new Error(`Failed to check status: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in checkJobStatus:', error);
      throw error;
    }
  }

  /**
   * Get all VFusion3D jobs for a user
   */
  static async getUserJobs(userId: string): Promise<VFusion3DJob[]> {
    try {
      const { data, error } = await supabase
        .from('vfusion3d_jobs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch jobs: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserJobs:', error);
      throw error;
    }
  }

  /**
   * Update job status in database
   */
  static async updateJobStatus(
    predictionId: string, 
    status: string, 
    resultUrl?: string, 
    errorMessage?: string
  ): Promise<void> {
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };

      if (resultUrl) {
        updateData.result_url = resultUrl;
      }

      if (errorMessage) {
        updateData.error_message = errorMessage;
      }

      const { error } = await supabase
        .from('vfusion3d_jobs')
        .update(updateData)
        .eq('prediction_id', predictionId);

      if (error) {
        throw new Error(`Failed to update job status: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in updateJobStatus:', error);
      throw error;
    }
  }

  /**
   * Download the generated 3D model
   */
  static async downloadModel(resultUrl: string, fileName: string = 'model.obj'): Promise<void> {
    try {
      const response = await fetch(resultUrl);
      if (!response.ok) {
        throw new Error('Failed to download model');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading model:', error);
      throw error;
    }
  }
}