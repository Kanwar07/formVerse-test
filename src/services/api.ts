
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];
type Model = Tables['models']['Row'];
type Profile = Tables['profiles']['Row'];
type Transaction = Tables['transactions']['Row'];
type UserLicense = Tables['user_licenses']['Row'];
type ModelLicense = Tables['model_licenses']['Row'];

export class APIService {
  // Authentication & Users
  static async getUserProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    return data;
  }

  static async updateUserRole(userId: string, role: 'creator' | 'buyer' | 'admin') {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);
    
    if (error) throw error;
    return data;
  }

  // Models Management
  static async uploadModel(modelData: {
    name: string;
    description?: string;
    file_path: string;
    file_type: string;
    file_size_mb: number;
    file_hash: string;
    tags?: string[];
    category?: string;
    preview_image?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('models')
      .insert({
        ...modelData,
        user_id: user.id,
        processing_status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    // Trigger FormIQ analysis
    await this.triggerFormIQAnalysis(data.id);
    
    return data;
  }

  static async getModels(filters?: {
    category?: string;
    tags?: string[];
    search?: string;
    user_id?: string;
  }) {
    let query = supabase
      .from('models')
      .select(`
        *,
        profiles!models_user_id_fkey(username, full_name, avatar_url),
        model_licenses(
          id,
          license_type_id,
          price,
          license_types(name, description, allows_commercial)
        )
      `)
      .eq('status', 'published')
      .eq('admin_status', 'approved');

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getModelById(modelId: string) {
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

    if (error) throw error;
    return data;
  }

  // Licensing System
  static async createModelLicense(modelId: string, licenseTypeId: string, price: number) {
    const { data, error } = await supabase
      .from('model_licenses')
      .insert({
        model_id: modelId,
        license_type_id: licenseTypeId,
        price
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getLicenseTypes() {
    const { data, error } = await supabase
      .from('license_types')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }

  static async purchaseLicense(modelId: string, licenseTypeId: string, paymentData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get license details
    const { data: license } = await supabase
      .from('model_licenses')
      .select('*, license_types(*)')
      .eq('model_id', modelId)
      .eq('license_type_id', licenseTypeId)
      .single();

    if (!license) throw new Error('License not found');

    // Create transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        model_id: modelId,
        license_type_id: licenseTypeId,
        amount: license.price,
        payment_method: paymentData.method,
        payment_id: paymentData.payment_id,
        status: 'pending',
        metadata: paymentData
      })
      .select()
      .single();

    if (transactionError) throw transactionError;

    return transaction;
  }

  static async confirmTransaction(transactionId: string) {
    const { data: transaction, error } = await supabase
      .from('transactions')
      .update({ 
        status: 'completed', 
        completed_at: new Date().toISOString() 
      })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) throw error;

    // Create user license
    const { data: userLicense } = await supabase
      .from('user_licenses')
      .insert({
        user_id: transaction.user_id,
        model_id: transaction.model_id,
        license_type_id: transaction.license_type_id,
        transaction_id: transaction.id
      })
      .select()
      .single();

    // Check if license is exclusive and revoke others
    const { data: licenseType } = await supabase
      .from('license_types')
      .select('is_exclusive')
      .eq('id', transaction.license_type_id)
      .single();

    if (licenseType?.is_exclusive) {
      await supabase.rpc('revoke_existing_licenses', { 
        target_model_id: transaction.model_id 
      });
    }

    return { transaction, userLicense };
  }

  // Download Management
  static async generateDownloadToken(modelId: string, licenseId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.rpc('generate_download_token', {
      user_id_param: user.id,
      model_id_param: modelId,
      license_id_param: licenseId
    });

    if (error) throw error;
    return data;
  }

  static async validateDownloadToken(token: string) {
    const { data, error } = await supabase
      .from('model_downloads')
      .select(`
        *,
        model_id,
        user_licenses(is_revoked, expires_at),
        models(file_path, name)
      `)
      .eq('download_token', token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error) throw error;
    return data;
  }

  // FormIQ Integration
  static async triggerFormIQAnalysis(modelId: string) {
    // Create FormIQ job entry
    const { data, error } = await supabase
      .from('formiq_jobs')
      .insert({
        model_id: modelId,
        job_status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    // In a real implementation, this would call the FormIQ API
    // For now, we'll simulate the analysis after a delay
    setTimeout(async () => {
      await this.completeFormIQAnalysis(data.id, {
        printability_score: Math.floor(Math.random() * 100),
        material_recommendations: ['PLA', 'ABS', 'PETG'],
        printing_techniques: ['FDM', 'SLA'],
        design_issues: [],
        oem_compatibility: [
          { name: 'Prusa i3', score: 85 },
          { name: 'Ender 3', score: 78 }
        ]
      });
    }, 5000);

    return data;
  }

  static async completeFormIQAnalysis(jobId: string, analysisData: any) {
    // Update job status
    await supabase
      .from('formiq_jobs')
      .update({
        job_status: 'completed',
        result_data: analysisData,
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId);

    // Get model ID from job
    const { data: job } = await supabase
      .from('formiq_jobs')
      .select('model_id')
      .eq('id', jobId)
      .single();

    if (job) {
      // Create FormIQ analysis record
      await supabase
        .from('formiq_analyses')
        .insert({
          model_id: job.model_id,
          ...analysisData
        });

      // Update model with analysis results
      await supabase
        .from('models')
        .update({
          printability_score: analysisData.printability_score,
          material_recommendations: analysisData.material_recommendations,
          printing_techniques: analysisData.printing_techniques,
          design_issues: analysisData.design_issues,
          oem_compatibility: analysisData.oem_compatibility,
          processing_status: 'completed'
        })
        .eq('id', job.model_id);
    }
  }

  // Analytics
  static async trackModelEvent(modelId: string, eventType: string, metadata?: any) {
    const { data: { user } } = await supabase.auth.getUser();
    
    return supabase
      .from('model_analytics')
      .insert({
        model_id: modelId,
        event_type: eventType,
        user_id: user?.id,
        metadata: metadata || {}
      });
  }

  // Admin Functions
  static async getAdminStats() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    // Get various stats
    const [modelsCount, usersCount, transactionsData, reportsCount] = await Promise.all([
      supabase.from('models').select('id', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact' }),
      supabase.from('transactions').select('amount, status'),
      supabase.from('model_reports').select('id', { count: 'exact' }).eq('status', 'pending')
    ]);

    const totalRevenue = transactionsData.data
      ?.filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    return {
      totalModels: modelsCount.count || 0,
      totalUsers: usersCount.count || 0,
      totalRevenue,
      pendingReports: reportsCount.count || 0
    };
  }

  static async moderateModel(modelId: string, action: 'approve' | 'reject', reason?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('models')
      .update({
        admin_status: action === 'approve' ? 'approved' : 'rejected'
      })
      .eq('id', modelId)
      .select()
      .single();

    if (error) throw error;

    // Log admin action
    await supabase
      .from('admin_logs')
      .insert({
        admin_id: user.id,
        action: `model_${action}`,
        target_type: 'model',
        target_id: modelId,
        details: { reason }
      });

    return data;
  }
}
