import { useState, useEffect, useRef } from 'react';
import { UnifiedCADViewer } from '@/components/preview/UnifiedCADViewer';
import { supabase } from '@/integrations/supabase/client';

interface Model3DThumbnailProps {
  modelId: string;
  filePath: string;
  className?: string;
}

export const Model3DThumbnail = ({ modelId, filePath, className = "" }: Model3DThumbnailProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !modelUrl && !error) {
          setIsVisible(true);
          loadModel();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [modelUrl, error]);

  const loadModel = async () => {
    try {
      console.log('Loading model from filePath:', filePath);
      
      // Check if it's already a complete URL
      if (filePath.startsWith('http') || filePath.startsWith('blob:')) {
        setModelUrl(filePath);
        return;
      }
      
      // Get public URL from Supabase storage
      const { data } = supabase.storage.from('3d-models').getPublicUrl(filePath);
      setModelUrl(data.publicUrl);
    } catch (err) {
      console.error('Error loading model for thumbnail:', err, 'filePath:', filePath);
      setError(true);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (modelUrl && modelUrl.startsWith('blob:')) {
        URL.revokeObjectURL(modelUrl);
      }
    };
  }, [modelUrl]);

  if (error) {
    return (
      <div 
        ref={containerRef}
        className={`w-full h-full bg-muted rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="text-xs text-muted-foreground text-center p-2">
          Preview<br/>unavailable
        </div>
      </div>
    );
  }

  if (!isVisible || !modelUrl) {
    return (
      <div 
        ref={containerRef}
        className={`w-full h-full bg-muted rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="text-xs text-muted-foreground">3D Preview</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full rounded-lg overflow-hidden ${className}`}
    >
      <UnifiedCADViewer
        fileUrl={modelUrl}
        fileName={`model-${modelId}`}
        width={300}
        height={200}
        showControls={false}
        autoRotate={true}
        onClose={() => {}}
        className="w-full h-full"
      />
    </div>
  );
};