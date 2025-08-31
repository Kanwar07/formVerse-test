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
  file_path: string;
}

interface UserStats {
  totalModels: number;
  totalDownloads: number;
  totalRevenue: number;
  uniqueBuyers: number;
}

interface FilterOptions {
  status?: 'all' | 'published' | 'draft';
  category?: string;
}

interface SortOptions {
  field: 'created_at' | 'name' | 'printability_score' | 'downloads' | 'revenue';
  direction: 'asc' | 'desc';
}

export const useUserModels = (page = 1, limit = 12, filters: FilterOptions = {}, sort: SortOptions = { field: 'created_at', direction: 'desc' }) => {
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

      // Build query with filters
      let query = supabase
        .from('models')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        if (filters.status === 'published') {
          query = query.eq('is_published', true);
        } else if (filters.status === 'draft') {
          query = query.eq('is_published', false);
        }
      }

      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      // Apply sorting
      if (sort.field === 'revenue') {
        // For revenue, we need to sort by calculated field (price * downloads)
        query = query.order('price', { ascending: sort.direction === 'asc' });
      } else {
        query = query.order(sort.field, { ascending: sort.direction === 'asc' });
      }

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data: modelsData, error: modelsError, count } = await query;

      if (modelsError) throw modelsError;

      console.log('Dashboard - fetched models:', modelsData?.length);
      console.log('Dashboard - first model sample:', modelsData?.[0]);

      let sortedData = modelsData || [];
      
      // Custom sort for revenue since we can't sort by calculated field in Supabase
      if (sort.field === 'revenue') {
        sortedData = sortedData.sort((a, b) => {
          const revenueA = (a.price || 0) * (a.downloads || 0);
          const revenueB = (b.price || 0) * (b.downloads || 0);
          return sort.direction === 'asc' ? revenueA - revenueB : revenueB - revenueA;
        });
      }

      setModels(sortedData);
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
  }, [user, page, limit, filters, sort]);

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

      // Show appropriate success message
      toast.success(
        isPublished 
          ? 'Model published successfully' 
          : 'Model unpublished successfully'
      );

      // If unpublishing and user is on model details page, redirect to dashboard
      if (!isPublished && window.location.pathname.includes(`/model/${modelId}`)) {
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500); // Short delay to allow user to see the success message
      }

    } catch (err) {
      console.error('Error updating model status:', err);
      toast.error('Failed to update model status');
    } finally {
      setUpdating(null);
    }
  }, [user]);

  const updateModel = useCallback(async (modelId: string, updates: Partial<Model>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('models')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', modelId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setModels(prev => prev.map(model => 
        model.id === modelId 
          ? { ...model, ...updates }
          : model
      ));

      return true;
    } catch (err) {
      console.error('Error updating model:', err);
      toast.error('Failed to update model');
      return false;
    }
  }, [user]);

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
    updateModelPublishStatus,
    updateModel,
    deleteModel,
    refetch: fetchModels
  };
};