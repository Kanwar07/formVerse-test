import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Box, Image, Download, Lock, Info, Zap } from 'lucide-react';
import { ModelViewer3D } from './ModelViewer3D';
import { ForgeViewer } from './ForgeViewer';
import { WatermarkCanvas } from './WatermarkCanvas';
import { ComprehensiveCADViewer } from '../three/ComprehensiveCADViewer';

type PreviewMode = 'image' | '3d' | 'forge' | 'advanced';

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

  const handleForgePreview = () => {
    if (canView3D && hasFileAccess) {
      setPreviewMode('forge');
    }
  };

  const handleAdvancedPreview = () => {
    if (canView3D && hasFileAccess) {
      setPreviewMode('advanced');
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
            variant={previewMode === '3d' ? 'default' : 'outline'}
            size="sm"
            onClick={handle3DPreview}
            disabled={!canView3D || !hasFileAccess}
          >
            <Box className="h-4 w-4 mr-2" />
            Basic 3D
            {!canView3D && <Lock className="h-3 w-3 ml-1" />}
          </Button>

          <Button
            variant={previewMode === 'forge' ? 'default' : 'outline'}
            size="sm"
            onClick={handleForgePreview}
            disabled={!canView3D || !hasFileAccess}
            className="relative"
          >
            <Zap className="h-4 w-4 mr-2" />
            CAD Viewer
            <Badge variant="secondary" className="ml-2 text-xs">Pro</Badge>
            {!canView3D && <Lock className="h-3 w-3 ml-1" />}
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
            <Badge variant="default" className="ml-2 text-xs bg-primary">New</Badge>
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
      <div className="flex gap-2 flex-wrap">
        {isOwner && <Badge variant="secondary">Your Model</Badge>}
        {isPurchased && !isOwner && <Badge variant="outline">Purchased</Badge>}
        {!isOwner && !isPurchased && <Badge variant="destructive">Preview Mode</Badge>}
        {previewMode === '3d' && canView3D && <Badge variant="default">Basic 3D View</Badge>}
        {previewMode === 'forge' && canView3D && <Badge variant="default" className="bg-orange-500">Forge CAD Viewer</Badge>}
        {previewMode === 'advanced' && canView3D && <Badge variant="default" className="bg-primary">Advanced CAD Viewer</Badge>}
        {modelInfo && <Badge variant="outline">{modelInfo.fileType.toUpperCase()}</Badge>}
      </div>

      {/* Model Information Display */}
      {modelInfo && (previewMode === '3d' || previewMode === 'forge' || previewMode === 'advanced') && (
        <div className="bg-muted/50 rounded-lg p-3 text-sm">
          <h4 className="font-medium mb-2 flex items-center">
            <Info className="h-4 w-4 mr-2" />
            Model Information
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><strong>File Name:</strong> {modelInfo.fileName}</div>
            <div><strong>File Size:</strong> {modelInfo.fileSizeFormatted}</div>
            <div><strong>Format:</strong> {modelInfo.fileType.toUpperCase()}</div>
            <div><strong>Viewer:</strong> {previewMode === 'forge' ? 'Autodesk Forge' : previewMode === 'advanced' ? 'Advanced CAD Viewer' : 'Three.js'}</div>
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
      ) : previewMode === 'forge' ? (
        /* Autodesk Forge Viewer */
        hasFileAccess && canView3D ? (
          <ForgeViewer
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
              <p className="text-muted-foreground font-medium">CAD Viewer Locked</p>
              <p className="text-sm text-muted-foreground">
                {!canView3D ? 'Purchase required for professional CAD viewer' : 'Model file not available'}
              </p>
            </div>
          </div>
        )
      ) : previewMode === 'advanced' ? (
        /* Advanced CAD Viewer */
        hasFileAccess && canView3D ? (
          <ComprehensiveCADViewer
            fileUrl={fileUrl!}
            fileName={fileName!}
            fileType={fileType!}
            onClose={() => setPreviewMode('image')}
          />
        ) : (
          <div className="border rounded-lg aspect-square flex items-center justify-center bg-muted/50">
            <div className="text-center">
              <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground font-medium">Advanced CAD Viewer Locked</p>
              <p className="text-sm text-muted-foreground">
                {!canView3D ? 'Purchase required for advanced CAD analysis' : 'Model file not available'}
              </p>
            </div>
          </div>
        )
      ) : (
        /* Basic 3D Viewer */
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
           : previewMode === 'forge'
             ? 'Professional CAD viewer with industry-standard accuracy'
             : previewMode === 'advanced'
               ? 'Advanced CAD viewer with automatic analysis and issue detection'
               : modelInfo 
                 ? `Basic 3D viewer - ${modelInfo.fileSizeFormatted} ${modelInfo.fileType.toUpperCase()} file`
                 : 'Basic 3D model viewer - interact with the model above'
        }
      </p>
    </div>
  );
};
