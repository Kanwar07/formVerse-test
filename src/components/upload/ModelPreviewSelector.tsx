import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Grid3X3, 
  Play, 
  Pause,
  Maximize2,
  Download,
  Info
} from 'lucide-react';
import { UniversalModelViewer } from '../preview/UniversalModelViewer';
import { SimpleSTLViewer } from '../preview/SimpleSTLViewer';

interface ModelPreviewSelectorProps {
  fileUrl: string;
  fileName: string;
  fileType: string;
  className?: string;
}

type ViewerType = 'universal' | 'simple' | 'legacy';

export const ModelPreviewSelector = ({
  fileUrl,
  fileName,
  fileType,
  className
}: ModelPreviewSelectorProps) => {
  const [viewerType, setViewerType] = useState<ViewerType>('universal');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Determine supported formats
  const isSTLFile = fileType.toLowerCase() === 'stl';
  const isAdvancedFormat = ['obj', 'gltf', 'glb', 'ply', 'step', 'iges'].includes(fileType.toLowerCase());

  const ViewerControls = () => (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
        <Button
          variant={viewerType === 'universal' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewerType('universal')}
          disabled={!isAdvancedFormat && !isSTLFile}
        >
          Universal
        </Button>
        {isSTLFile && (
          <Button
            variant={viewerType === 'simple' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewerType('simple')}
          >
            Simple
          </Button>
        )}
      </div>
      
      <Badge variant="outline" className="text-xs">
        {fileType.toUpperCase()}
      </Badge>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="ml-auto"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
    </div>
  );

  // Render appropriate viewer based on selection and file type
  const renderViewer = () => {
    const commonProps = {
      fileUrl,
      fileName,
      className: isFullscreen ? 'fixed inset-0 z-50 bg-background' : undefined
    };

    switch (viewerType) {
      case 'universal':
        return (
          <UniversalModelViewer
            {...commonProps}
            onClose={isFullscreen ? () => setIsFullscreen(false) : undefined}
            autoRotate={false}
            showGrid={true}
            showGizmo={true}
          />
        );
        
      case 'simple':
        if (isSTLFile) {
          return (
            <SimpleSTLViewer
              fileUrl={fileUrl}
              className={commonProps.className}
              background="white"
            />
          );
        }
        // Fallback to universal for non-STL files
        return (
          <UniversalModelViewer
            {...commonProps}
            onClose={isFullscreen ? () => setIsFullscreen(false) : undefined}
          />
        );
        
      default:
        return (
          <UniversalModelViewer
            {...commonProps}
            onClose={isFullscreen ? () => setIsFullscreen(false) : undefined}
          />
        );
    }
  };

  return (
    <div className={className}>
      {!isFullscreen && <ViewerControls />}
      {renderViewer()}
    </div>
  );
};