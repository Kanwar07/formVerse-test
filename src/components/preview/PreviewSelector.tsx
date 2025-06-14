
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Box, Image, Download, Lock, Info } from 'lucide-react';
import { ModelViewer3D } from './ModelViewer3D';
import { WatermarkCanvas } from './WatermarkCanvas';

type PreviewMode = 'image' | '3d';

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
  const [previewMode, setPreviewMode] = useState<PreviewMode>('image');
  const [showWatermark, setShowWatermark] = useState(!isOwner && !isPurchased);
  const [watermarkedImage, setWatermarkedImage] = useState<string>("");
  const [modelInfo, setModelInfo] = useState<any>(null);

  const canView3D = isOwner || isPurchased;
  const hasFileAccess = fileUrl && fileName && fileType;

  const handlePreviewToggle = () => {
    if (!isOwner && !isPurchased) {
      setShowWatermark(!showWatermark);
      return;
    }
    setShowWatermark(!showWatermark);
  };

  const handle3DPreview = () => {
    if (canView3D && hasFileAccess) {
      setPreviewMode('3d');
    }
  };

  const handleModelInfo = (info: any) => {
    setModelInfo(info);
    console.log('Model information received:', info);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preview Mode Selector */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={previewMode === 'image' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('image')}
          >
            <Image className="h-4 w-4 mr-2" />
            Image Preview
          </Button>
          
          <Button
            variant={previewMode === '3d' ? 'default' : 'outline'}
            size="sm"
            onClick={handle3DPreview}
            disabled={!canView3D || !hasFileAccess}
          >
            <Box className="h-4 w-4 mr-2" />
            3D Viewer
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
          
          {modelInfo && (
            <Button variant="outline" size="sm">
              <Info className="h-4 w-4 mr-2" />
              {modelInfo.fileSizeFormatted}
            </Button>
          )}
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex gap-2">
        {isOwner && <Badge variant="secondary">Your Model</Badge>}
        {isPurchased && !isOwner && <Badge variant="outline">Purchased</Badge>}
        {!isOwner && !isPurchased && <Badge variant="destructive">Preview Mode</Badge>}
        {previewMode === '3d' && canView3D && <Badge variant="default">3D View Active</Badge>}
        {modelInfo && <Badge variant="outline">{modelInfo.fileType.toUpperCase()}</Badge>}
      </div>

      {/* Model Information Display */}
      {modelInfo && previewMode === '3d' && (
        <div className="bg-muted/50 rounded-lg p-3 text-sm">
          <h4 className="font-medium mb-2 flex items-center">
            <Info className="h-4 w-4 mr-2" />
            Model Information
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><strong>File Name:</strong> {modelInfo.fileName}</div>
            <div><strong>File Size:</strong> {modelInfo.fileSizeFormatted}</div>
            <div><strong>Format:</strong> {modelInfo.fileType.toUpperCase()}</div>
            <div><strong>Status:</strong> Successfully Loaded</div>
          </div>
        </div>
      )}

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
        /* 3D Viewer */
        hasFileAccess && canView3D ? (
          <ModelViewer3D
            fileUrl={fileUrl!}
            fileName={fileName!}
            fileType={fileType!}
            onClose={() => setPreviewMode('image')}
            onModelInfo={handleModelInfo}
          />
        ) : (
          <div className="border rounded-lg aspect-square flex items-center justify-center bg-muted/50">
            <div className="text-center">
              <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground font-medium">3D Preview Locked</p>
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
          : modelInfo 
            ? `3D model loaded - ${modelInfo.fileSizeFormatted} ${modelInfo.fileType.toUpperCase()} file`
            : '3D model viewer - interact with the model above'
        }
      </p>
    </div>
  );
};
