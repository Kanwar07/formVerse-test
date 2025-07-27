import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Box, Image, Download, Lock, Info } from 'lucide-react';
import { WatermarkCanvas } from './WatermarkCanvas';
import { SimpleSTLViewer } from './SimpleSTLViewer';

type PreviewMode = 'image' | 'advanced';

interface PreviewSelectorProps {
  modelName: string;
  thumbnail: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  isOwner?: boolean;
  isPurchased?: boolean;
  price?: number;
  onPurchase?: () => void;
  className?: string;
}

export const PreviewSelector = ({ 
  modelName, 
  thumbnail, 
  fileUrl,
  fileName,
  fileType,
  isOwner = false, 
  isPurchased = false,
  price,
  onPurchase,
  className = ""
}: PreviewSelectorProps) => {
  // Auto-default to 3D view for owners with file access, otherwise image
  const getInitialMode = (): PreviewMode => {
    if (isOwner && fileUrl && fileName && fileType) {
      return 'advanced'; // Default to best viewer for uploaded files
    }
    return 'image';
  };
  
  const [previewMode, setPreviewMode] = useState<PreviewMode>(getInitialMode);
  const [showWatermark, setShowWatermark] = useState(!isOwner && !isPurchased);
  const [watermarkedImage, setWatermarkedImage] = useState<string>("");

  const canView3D = isOwner || isPurchased;
  const hasFileAccess = fileUrl && fileName && fileType;

  const handlePreviewToggle = () => {
    if (!isOwner && !isPurchased) {
      setShowWatermark(!showWatermark);
      return;
    }
    setShowWatermark(!showWatermark);
  };

  const handleAdvancedPreview = () => {
    if (canView3D && hasFileAccess) {
      setPreviewMode('advanced');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preview Mode Selector */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={previewMode === 'image' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('image')}
          >
            <Image className="h-4 w-4 mr-2" />
            Image Preview
          </Button>

          <Button
            variant={previewMode === 'advanced' ? 'default' : 'outline'}
            size="sm"
            onClick={handleAdvancedPreview}
            disabled={!canView3D || !hasFileAccess}
            className="relative"
          >
            <Box className="h-4 w-4 mr-2" />
            Advanced 3D
            <Badge variant="default" className="ml-2 text-xs bg-primary">Interactive</Badge>
            {!canView3D && <Lock className="h-3 w-3 ml-1" />}
          </Button>
        </div>

        <div className="flex gap-2">
          {previewMode === 'image' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviewToggle}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showWatermark && !isOwner && !isPurchased ? 'Show Preview' : 'Toggle View'}
            </Button>
          )}
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex gap-2 flex-wrap">
        {isOwner && <Badge variant="secondary">Your Model</Badge>}
        {isPurchased && !isOwner && <Badge variant="outline">Purchased</Badge>}
        {!isOwner && !isPurchased && <Badge variant="destructive">Preview Mode</Badge>}
        {previewMode === 'advanced' && canView3D && <Badge variant="default" className="bg-primary">3D Viewer Active</Badge>}
        {fileType && <Badge variant="outline">{fileType.toUpperCase()}</Badge>}
      </div>

      {/* Preview Content */}
      {previewMode === 'image' ? (
        <div className="relative group border rounded-lg overflow-hidden">
          {/* Image Preview */}
          {showWatermark && watermarkedImage ? (
            <img 
              src={watermarkedImage} 
              alt={`${modelName} - Watermarked Preview`}
              className="w-full aspect-square object-cover"
            />
          ) : (
            <img 
              src={thumbnail} 
              alt={modelName}
              className={`w-full aspect-square object-cover transition-all duration-300 ${
                showWatermark && !isOwner && !isPurchased ? 'blur-sm' : ''
              }`}
            />
          )}
          
          {/* Watermark overlay for non-owners */}
          {showWatermark && !isOwner && !isPurchased && !watermarkedImage && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-4xl font-bold opacity-60 transform rotate-12 mb-2">
                  PREVIEW
                </div>
                <div className="text-sm opacity-80">
                  FormIQ Marketplace
                </div>
                <Lock className="h-8 w-8 mx-auto mt-2 opacity-60" />
              </div>
            </div>
          )}

          {/* Hidden watermark generator */}
          {showWatermark && (
            <div style={{ display: 'none' }}>
              <WatermarkCanvas 
                imageUrl={thumbnail}
                watermarkText="FormIQ Preview"
                onWatermarkedImage={setWatermarkedImage}
              />
            </div>
          )}
        </div>
      ) : (
        /* Advanced 3D Viewer */
        hasFileAccess && canView3D ? (
          <div className="border rounded-lg overflow-hidden">
            <SimpleSTLViewer fileUrl={fileUrl!} />
          </div>
        ) : (
          <div className="border rounded-lg aspect-square flex items-center justify-center bg-muted/50">
            <div className="text-center">
              <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground font-medium">3D Viewer Locked</p>
              <p className="text-sm text-muted-foreground">
                {!canView3D ? 'Purchase required for 3D preview' : 'Model file not available'}
              </p>
            </div>
          </div>
        )
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {!isOwner && !isPurchased && price && (
          <Button onClick={onPurchase} className="flex-1">
            Buy for ₹{price}
          </Button>
        )}
        
        {(isOwner || isPurchased) && (
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download Files
          </Button>
        )}
      </div>

      {/* Info Text */}
      <p className="text-xs text-muted-foreground text-center">
        {previewMode === 'image' 
          ? (showWatermark && !isOwner && !isPurchased 
              ? 'Preview mode - watermarked for protection' 
              : 'Full quality preview')
          : 'Advanced 3D viewer - Pinch to zoom, drag to rotate'
        }
      </p>
    </div>
  );
};