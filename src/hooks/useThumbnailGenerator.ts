
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { OffscreenThumbnailGenerator } from '@/services/offscreenThumbnailGenerator';

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
      const result = await OffscreenThumbnailGenerator.generateThumbnail(
        modelFileUrl,
        fileName,
        fileType,
        userId,
        {
          width: 512,
          height: 512,
          quality: 0.85,
          format: 'png',
          backgroundColor: '#f8fafc',
          lightIntensity: 1.2
        }
      );
      
      console.log('=== HOOK: Thumbnail generation result ===', result);
      
      if (result.success && result.thumbnailUrl) {
        setThumbnailUrl(result.thumbnailUrl);
        toast({
          title: "3D Preview Generated!",
          description: `High-quality 3D thumbnail created (${result.metadata?.vertices.toLocaleString()} vertices)`,
        });
        return result.thumbnailUrl;
      } else {
        console.warn('3D thumbnail generation failed:', result.error);
        toast({
          title: "Preview generation failed",
          description: "Could not generate 3D preview, using fallback.",
          variant: "destructive"
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
