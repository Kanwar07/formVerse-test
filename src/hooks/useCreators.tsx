
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
        
        // Fetch published models with their creators
        const { data: modelsData, error: modelsError } = await supabase
          .from('models')
          .select('user_id, downloads, rating')
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
              totalDownloads: 0,
              totalRating: 0,
              ratingCount: 0
            };
          }
          acc[userId].models += 1;
          acc[userId].totalDownloads += model.downloads || 0;
          if (model.rating) {
            acc[userId].totalRating += model.rating;
            acc[userId].ratingCount += 1;
          }
          return acc;
        }, {});

        // Get user profiles for the creators
        const userIds = Object.keys(creatorStats);
        
        if (userIds.length === 0) {
          setCreators([]);
          return;
        }

        // Fetch real profile data from profiles table
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, email, avatar_url, bio')
          .in('id', userIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }

        // Create creators array with real profile data
        const realCreators: Creator[] = userIds.map((userId) => {
          const stats = creatorStats[userId];
          const profile = profilesData?.find(p => p.id === userId);
          
          // Generate display name from profile data
          const displayName = profile?.username || 
                             profile?.email?.split('@')[0] || 
                             `Creator_${userId.slice(0, 8)}`;
          
          const avgRating = stats.ratingCount > 0 
            ? Number((stats.totalRating / stats.ratingCount).toFixed(1))
            : 0;

          return {
            id: userId,
            name: displayName,
            username: profile?.username || displayName.toLowerCase().replace(/\s+/g, '_'),
            avatar: profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff`,
            bio: profile?.bio || 'CAD designer and 3D modeling enthusiast',
            premium: false, // Could be determined by subscription status if available
            rating: avgRating,
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
