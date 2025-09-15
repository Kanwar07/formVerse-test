
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

        // Fetch profiles for these creators
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, email, avatar_url, bio, role')
          .in('id', creatorUserIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw profilesError;
        }

        // Create creators array with real profile data
        const realCreators: Creator[] = (profilesData || []).map((profile) => {
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
