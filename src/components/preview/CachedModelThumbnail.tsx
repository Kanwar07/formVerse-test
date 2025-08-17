import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { FileText, AlertCircle } from 'lucide-react';

interface CachedModelThumbnailProps {
  thumbnailUrl?: string | null;
  modelName: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
}

export const CachedModelThumbnail: React.FC<CachedModelThumbnailProps> = ({
  thumbnailUrl,
  modelName,
  className = "",
  fallbackIcon,
  onClick,
  loading = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const showFallback = !thumbnailUrl || imageError || loading;

  return (
    <div 
      className={cn(
        "relative w-full h-full rounded-lg overflow-hidden bg-muted/50 border border-border/50",
        "transition-all duration-200 hover:shadow-md hover:border-border",
        onClick && "cursor-pointer hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
    >
      {!showFallback && (
        <>
          <img
            src={thumbnailUrl}
            alt={`3D preview of ${modelName}`}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              imageLoading && "opacity-0"
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
          
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </>
      )}

      {showFallback && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          {loading ? (
            <>
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
              <span className="text-xs text-muted-foreground text-center">
                Generating preview...
              </span>
            </>
          ) : imageError ? (
            <>
              <AlertCircle className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground text-center">
                Preview unavailable
              </span>
            </>
          ) : (
            <>
              {fallbackIcon || <FileText className="w-8 h-8 text-muted-foreground mb-2" />}
              <span className="text-xs text-muted-foreground text-center">
                3D Model
              </span>
              <span className="text-xs text-muted-foreground/70 text-center mt-1 line-clamp-2">
                {modelName}
              </span>
            </>
          )}
        </div>
      )}

      {/* Gradient overlay for better text readability on detail hover */}
      {onClick && !showFallback && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200" />
      )}
    </div>
  );
};