import React from 'react';
import { UniversalModelViewer } from './UniversalModelViewer';
import { ModelViewerErrorBoundary } from '../common/ModelViewerErrorBoundary';

interface SafeModelViewerProps {
  fileUrl: string;
  fileName: string;
  modelDownloadUrl?: string;
  onClose?: () => void;
  autoRotate?: boolean;
  showGrid?: boolean;
  showGizmo?: boolean;
  background?: 'white' | 'grey' | 'black' | 'custom';
  backgroundImage?: string;
  onBackgroundChange?: (bg: 'white' | 'grey' | 'black' | 'custom') => void;
  onBackgroundImageUpload?: (image: string) => void;
  className?: string;
}

export const SafeModelViewer: React.FC<SafeModelViewerProps> = ({ 
  modelDownloadUrl, 
  ...props 
}) => {
  // Validate the fileUrl before attempting to render
  const isValidUrl = props.fileUrl && (
    props.fileUrl.startsWith('blob:') || 
    props.fileUrl.startsWith('data:') || 
    props.fileUrl.startsWith('http')
  );

  if (!isValidUrl) {
    console.warn('SafeModelViewer: Invalid or missing fileUrl:', props.fileUrl);
    return (
      <div className="p-6 border rounded-lg bg-muted/20">
        <div className="text-center text-muted-foreground">
          <p>3D preview unavailable</p>
          <p className="text-sm mt-2">Invalid model URL provided</p>
          {modelDownloadUrl && (
            <button 
              onClick={() => window.open(modelDownloadUrl, '_blank')}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Download Model
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <ModelViewerErrorBoundary 
      modelDownloadUrl={modelDownloadUrl}
      onRetry={() => window.location.reload()}
    >
      <UniversalModelViewer 
        {...props}
        // Override settings for consistent framing
        autoRotate={props.autoRotate ?? false}
        showGrid={props.showGrid ?? true}
        showGizmo={props.showGizmo ?? true}
      />
    </ModelViewerErrorBoundary>
  );
};
