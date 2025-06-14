
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ThumbnailService } from '@/services/thumbnailService';

export const useThumbnailGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const generateThumbnail = useCallback(async (
    modelFileUrl: string,
    fileName: string,
    fileType: string,
    userId: string
  ) => {
    setIsGenerating(true);
    
    try {
      console.log('Starting thumbnail generation for:', fileName);
      
      const result = await ThumbnailService.generateThumbnail(
        modelFileUrl,
        fileName,
        fileType,
        userId
      );
      
      if (result.success && result.thumbnailUrl) {
        setThumbnailUrl(result.thumbnailUrl);
        toast({
          title: "Thumbnail generated!",
          description: "Model preview image has been created successfully.",
        });
        return result.thumbnailUrl;
      } else {
        throw new Error(result.error || 'Thumbnail generation failed');
      }
    } catch (error) {
      console.error('Error in thumbnail generation:', error);
      toast({
        title: "Thumbnail generation failed",
        description: "We'll use a placeholder image instead.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  const uploadThumbnail = useCallback(async (
    dataUrl: string,
    fileName: string,
    userId: string
  ): Promise<string | null> => {
    try {
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // Create file path for thumbnail
      const timestamp = Date.now();
      const thumbnailFileName = `thumbnail-${timestamp}-${fileName.replace(/\.[^/.]+$/, '')}.png`;
      const filePath = `${userId}/thumbnails/${thumbnailFileName}`;
      
      console.log('Uploading thumbnail to path:', filePath);
      
      // Upload thumbnail to Supabase storage
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.storage
        .from('3d-models')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Thumbnail upload error:', error);
        return null;
      }

      // Get public URL for the thumbnail
      const { data: urlData } = supabase.storage
        .from('3d-models')
        .getPublicUrl(data.path);

      console.log('Thumbnail uploaded successfully:', urlData.publicUrl);
      setThumbnailUrl(urlData.publicUrl);
      return urlData.publicUrl;
      
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      return null;
    }
  }, []);

  return {
    isGenerating,
    thumbnailUrl,
    generateThumbnail,
    uploadThumbnail,
    setThumbnailUrl
  };
};
