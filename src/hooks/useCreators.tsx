
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
        
        // Fetch creators with their model counts and total downloads
        const { data: creatorsData, error: creatorsError } = await supabase
          .from('models')
          .select(`
            user_id,
            downloads
          `);

        if (creatorsError) {
          throw creatorsError;
        }

        // Group by user_id and calculate stats
        const creatorStats = creatorsData?.reduce((acc: any, model: any) => {
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

        // Get user profiles for the creators
        const userIds = Object.keys(creatorStats || {});
        
        if (userIds.length === 0) {
          setCreators([]);
          return;
        }

        // For now, we'll create mock profile data since we don't have a profiles table
        // In a real app, you'd fetch this from a profiles table
        const mockCreators: Creator[] = userIds.map((userId, index) => {
          const stats = creatorStats[userId];
          const mockNames = ['Alex Johnson', 'Sarah Chen', 'Mike Rodriguez', 'Emily Davis', 'David Kim'];
          const mockUsernames = ['alexj', 'sarahc', 'miker', 'emilyd', 'davidk'];
          const mockAvatars = [
            'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=256&h=256&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1664575602554-2087b04935a5?q=80&w=256&h=256&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&fit=crop&auto=format'
          ];

          return {
            id: userId,
            name: mockNames[index % mockNames.length] || `Creator ${index + 1}`,
            username: mockUsernames[index % mockUsernames.length] || `creator${index + 1}`,
            avatar: mockAvatars[index % mockAvatars.length],
            bio: 'CAD designer specializing in 3D modeling and product design',
            premium: Math.random() > 0.5,
            rating: Number((4.0 + Math.random() * 1.0).toFixed(1)),
            models: stats.models,
            downloads: stats.totalDownloads
          };
        });

        setCreators(mockCreators);
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
