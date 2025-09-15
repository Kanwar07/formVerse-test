
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

export const useCreators = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setLoading(true);
        
        // Use a more efficient query to join models with profiles directly
        // This gets all profiles that have published models along with their stats
        const { data: creatorsData, error: creatorsError } = await supabase
          .rpc('get_creators_with_stats');

        if (creatorsError) {
          console.error('RPC error:', creatorsError);
          // Fallback to manual approach if RPC doesn't exist
          await fetchCreatorsManually();
          return;
        }

        if (!creatorsData || creatorsData.length === 0) {
          setCreators([]);
          return;
        }

        // Transform the data to match our Creator interface
        const transformedCreators: Creator[] = creatorsData.map((creator: any) => {
          const displayName = creator.username || 
                             creator.email?.split('@')[0] || 
                             `Creator_${creator.id.slice(0, 8)}`;
          
          // Generate a consistent rating based on models and downloads ratio
          const rating = creator.model_count > 0 
            ? Math.min(5.0, Math.max(3.0, 3.5 + (creator.total_downloads / creator.model_count) / 100))
            : 0;

          return {
            id: creator.id,
            name: displayName,
            username: creator.username || displayName.toLowerCase().replace(/\s+/g, '_'),
            avatar: creator.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff`,
            bio: creator.bio || 'CAD designer and 3D modeling enthusiast',
            premium: creator.role === 'premium' || false,
            rating: Number(rating.toFixed(1)),
            models: creator.model_count || 0,
            downloads: creator.total_downloads || 0
          };
        });

        // Sort by total downloads by default
        transformedCreators.sort((a, b) => b.downloads - a.downloads);
        setCreators(transformedCreators);

      } catch (err) {
        console.error('Error fetching creators:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch creators');
      } finally {
        setLoading(false);
      }
    };

    // Fallback manual approach
    const fetchCreatorsManually = async () => {
      try {
        // First, get published models with their user_id and downloads
        const { data: modelsData, error: modelsError } = await supabase
          .from('models')
          .select('user_id, downloads')
          .eq('status', 'published')
          .eq('is_published', true)
          .eq('admin_status', 'approved')
          .eq('quality_status', 'approved');

        if (modelsError) {
          throw modelsError;
        }

        if (!modelsData || modelsData.length === 0) {
          setCreators([]);
          return;
        }

        // Group by user_id and calculate stats
        const creatorStats = modelsData.reduce((acc: any, model: any) => {
          const userId = model.user_id;
          if (!acc[userId]) {
            acc[userId] = {
              models: 0,
              totalDownloads: 0
            };
          }
          acc[userId].models += 1;
          acc[userId].totalDownloads += model.downloads || 0;
          return acc;
        }, {});

        // Get unique user IDs who have published models
        const creatorUserIds = Object.keys(creatorStats);
        
        if (creatorUserIds.length === 0) {
          setCreators([]);
          return;
        }

        // Try to fetch public profiles using the public function
        const { data: profilesData, error: profilesError } = await supabase
          .rpc('get_public_creators_profiles', { creator_ids: creatorUserIds });

        if (profilesError) {
          console.error('Error fetching public profiles:', profilesError);
          // Create minimal creator entries without full profile data
          const minimalCreators: Creator[] = creatorUserIds.map((userId) => {
            const stats = creatorStats[userId];
            const displayName = `Creator_${userId.slice(0, 8)}`;
            
            const rating = stats.models > 0 
              ? Math.min(5.0, Math.max(3.0, 3.5 + (stats.totalDownloads / stats.models) / 100))
              : 0;

            return {
              id: userId,
              name: displayName,
              username: displayName.toLowerCase(),
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff`,
              bio: 'CAD designer and 3D modeling enthusiast',
              premium: false,
              rating: Number(rating.toFixed(1)),
              models: stats.models,
              downloads: stats.totalDownloads
            };
          });
          
          minimalCreators.sort((a, b) => b.downloads - a.downloads);
          setCreators(minimalCreators);
          return;
        }

        // Create creators array with real profile data
        const realCreators: Creator[] = (profilesData || []).map((profile: any) => {
          const stats = creatorStats[profile.id];
          
          // Generate display name from profile data
          const displayName = profile.username || 
                             profile.email?.split('@')[0] || 
                             `Creator_${profile.id.slice(0, 8)}`;
          
          // Generate a consistent rating based on models and downloads ratio
          const rating = stats.models > 0 
            ? Math.min(5.0, Math.max(3.0, 3.5 + (stats.totalDownloads / stats.models) / 100))
            : 0;

          return {
            id: profile.id,
            name: displayName,
            username: profile.username || displayName.toLowerCase().replace(/\s+/g, '_'),
            avatar: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff`,
            bio: profile.bio || 'CAD designer and 3D modeling enthusiast',
            premium: profile.role === 'premium' || false,
            rating: Number(rating.toFixed(1)),
            models: stats.models,
            downloads: stats.totalDownloads
          };
        });

        // Sort by total downloads by default
        realCreators.sort((a, b) => b.downloads - a.downloads);
        setCreators(realCreators);
      } catch (err) {
        console.error('Error fetching creators:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch creators');
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, []);

  return { creators, loading, error };
};
