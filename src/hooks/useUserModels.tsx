import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';

interface Model {
  id: string;
  name: string;
  description: string | null;
  preview_image: string | null;
  printability_score: number | null;
  downloads: number;
  price: number | null;
  status: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  category: string | null;
  difficulty_level: string | null;
  tags: string[];
  quality_status: string;
  admin_status: string;
}

interface UserStats {
  totalModels: number;
  totalDownloads: number;
  totalRevenue: number;
  uniqueBuyers: number;
}

export const useUserModels = (page = 1, limit = 12) => {
  const { user } = useAuth();
  const [models, setModels] = useState<Model[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalModels: 0,
    totalDownloads: 0,
    totalRevenue: 0,
    uniqueBuyers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchModels = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const offset = (page - 1) * limit;

      // Fetch models with pagination
      const { data: modelsData, error: modelsError, count } = await supabase
        .from('models')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (modelsError) throw modelsError;

      setModels(modelsData || []);
      setHasMore((count || 0) > offset + limit);

      // Fetch user stats
      const { data: statsData, error: statsError } = await supabase
        .from('models')
        .select('downloads, price')
        .eq('user_id', user.id);

      if (statsError) throw statsError;

      const totalDownloads = statsData?.reduce((sum, model) => sum + (model.downloads || 0), 0) || 0;
      const totalRevenue = statsData?.reduce((sum, model) => sum + ((model.price || 0) * (model.downloads || 0)), 0) || 0;

      setStats({
        totalModels: count || 0,
        totalDownloads,
        totalRevenue,
        uniqueBuyers: Math.floor(totalDownloads * 0.3) // Approximate unique buyers
      });

    } catch (err) {
      console.error('Error fetching models:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch models');
    } finally {
      setLoading(false);
    }
  }, [user, page, limit]);

  const updateModelPublishStatus = useCallback(async (modelId: string, isPublished: boolean) => {
    if (!user) return;

    setUpdating(modelId);
    
    try {
      const { error } = await supabase
        .from('models')
        .update({ 
          is_published: isPublished,
          status: isPublished ? 'published' : 'draft',
          updated_at: new Date().toISOString()
        })
        .eq('id', modelId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setModels(prev => prev.map(model => 
        model.id === modelId 
          ? { ...model, is_published: isPublished, status: isPublished ? 'published' : 'draft' }
          : model
      ));

      toast.success(
        isPublished 
          ? 'Model published to marketplace' 
          : 'Model hidden from marketplace'
      );

    } catch (err) {
      console.error('Error updating model status:', err);
      toast.error('Failed to update model status');
    } finally {
      setUpdating(null);
    }
  }, [user]);

  // Debounced version of the update function
  const debouncedUpdateModelPublishStatus = useDebounce(updateModelPublishStatus, 500);

  const deleteModel = useCallback(async (modelId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('models')
        .delete()
        .eq('id', modelId)
        .eq('user_id', user.id);

      if (error) throw error;

      setModels(prev => prev.filter(model => model.id !== modelId));
      setStats(prev => ({ ...prev, totalModels: prev.totalModels - 1 }));
      
      toast.success('Model deleted successfully');
      
    } catch (err) {
      console.error('Error deleting model:', err);
      toast.error('Failed to delete model');
    }
  }, [user]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return {
    models,
    stats,
    loading,
    error,
    hasMore,
    updating,
    updateModelPublishStatus: debouncedUpdateModelPublishStatus,
    deleteModel,
    refetch: fetchModels
  };
};