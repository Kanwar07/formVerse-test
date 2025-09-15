import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  premium: boolean;
  rating: number;
  models: number;
  downloads: number;
  rank?: number;
}

export const useCreators = (limit?: number) => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const fetchCreators = async (isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
        setOffset(0);
      }

      const currentOffset = isLoadMore ? offset : 0;
      const fetchLimit = limit || 4;
      
      // Get users who have published models
      const { data: publishedModelUsers, error: modelsError } = await supabase
        .from('models')
        .select('user_id')
        .eq('status', 'published')
        .eq('is_published', true);

      if (modelsError) {
        throw modelsError;
      }

      if (!publishedModelUsers || publishedModelUsers.length === 0) {
        if (!isLoadMore) {
          setCreators([]);
        }
        setHasMore(false);
        return;
      }

      // Get unique user IDs
      const uniqueUserIds = [...new Set(publishedModelUsers.map(m => m.user_id))];
      
      // Apply pagination to user IDs
      const paginatedUserIds = uniqueUserIds.slice(currentOffset, currentOffset + fetchLimit);
      
      if (paginatedUserIds.length === 0) {
        setHasMore(false);
        return;
      }

      // Fetch profiles for these users
      const { data: creatorProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          email,
          avatar_url,
          bio,
          role,
          is_public
        `)
        .in('id', paginatedUserIds);

      if (profilesError) {
        throw profilesError;
      }

      // Get stats for each creator
      const creatorStats = await Promise.all(
        (creatorProfiles || []).map(async (profile) => {
          const { data: models, error: modelsError } = await supabase
            .from('models')
            .select('downloads')
            .eq('user_id', profile.id)
            .eq('status', 'published')
            .eq('is_published', true);

          if (modelsError) {
            console.error('Error fetching models for user:', profile.id, modelsError);
            return null;
          }

          const modelCount = models?.length || 0;
          const totalDownloads = models?.reduce((sum, model) => sum + (model.downloads || 0), 0) || 0;
          
          // Calculate rating based on downloads and model count
          const rating = modelCount > 0 
            ? Math.min(5.0, Math.max(3.0, 3.5 + (totalDownloads / modelCount) / 100))
            : 0;

          const displayName = profile.username || 
                             profile.email?.split('@')[0] || 
                             `Creator_${profile.id.slice(0, 8)}`;

          return {
            id: profile.id,
            name: displayName,
            username: profile.username || displayName.toLowerCase().replace(/\s+/g, '_'),
            avatar: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff`,
            bio: profile.bio || 'CAD designer and 3D modeling enthusiast',
            premium: profile.role === 'premium' || false,
            rating: Number(rating.toFixed(1)),
            models: modelCount,
            downloads: totalDownloads
          };
        })
      );

      const validCreators = creatorStats.filter(Boolean) as Creator[];
      
      // Sort by downloads by default
      validCreators.sort((a, b) => b.downloads - a.downloads);

      if (isLoadMore) {
        setCreators(prev => [...prev, ...validCreators]);
      } else {
        setCreators(validCreators);
      }
      
      setOffset(currentOffset + fetchLimit);
      setHasMore(paginatedUserIds.length === fetchLimit);

    } catch (err) {
      console.error('Error fetching creators:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch creators');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchCreators(true);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  return { creators, loading, error, hasMore, loadMore };
};