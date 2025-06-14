
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
    console.log('=== HOOK: Starting thumbnail generation ===');
    console.log('Model URL:', modelFileUrl);
    console.log('File Name:', fileName);
    
    setIsGenerating(true);
    setThumbnailUrl(null); // Reset previous thumbnail
    
    try {
      const result = await ThumbnailService.generateThumbnail(
        modelFileUrl,
        fileName,
        fileType,
        userId
      );
      
      console.log('=== HOOK: Thumbnail generation result ===', result);
      
      if (result.success && result.thumbnailUrl) {
        setThumbnailUrl(result.thumbnailUrl);
        toast({
          title: "Model preview generated!",
          description: "Your 3D model preview is ready.",
        });
        return result.thumbnailUrl;
      } else {
        console.warn('Thumbnail generation failed:', result.error);
        toast({
          title: "Using basic preview",
          description: "Generated a placeholder preview for your model.",
          variant: "default"
        });
        return null;
      }
    } catch (error) {
      console.error('Error in thumbnail generation hook:', error);
      toast({
        title: "Preview generation failed",
        description: "Using a basic placeholder for your model.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  return {
    isGenerating,
    thumbnailUrl,
    generateThumbnail,
    setThumbnailUrl
  };
};
