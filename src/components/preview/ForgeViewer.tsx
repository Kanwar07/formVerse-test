
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, RotateCcw, ZoomIn, ZoomOut, Move3d } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { forgeService } from '@/services/forgeService';

declare global {
  interface Window {
    Autodesk: any;
  }
}

interface ForgeViewerProps {
  fileUrl: string;
  fileName: string;
  fileType: string;
  onClose: () => void;
  onModelInfo?: (info: any) => void;
}

export const ForgeViewer = ({ fileUrl, fileName, fileType, onClose, onModelInfo }: ForgeViewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewer, setViewer] = useState<any>(null);
  const [modelInfo, setModelInfo] = useState<any>({
    fileName,
    fileType,
    viewer: 'Autodesk Forge'
  });
  const { toast } = useToast();

  useEffect(() => {
    // Set initial model info
    setModelInfo({
      fileName,
      fileType,
      viewer: 'Autodesk Forge'
    });

    if (onModelInfo) {
      onModelInfo({
        fileName,
        fileType,
        viewer: 'Autodesk Forge'
      });
    }
  }, [fileName, fileType, onModelInfo]);

  useEffect(() => {
    const loadForgeViewer = () => {
      return new Promise((resolve, reject) => {
        if (window.Autodesk) {
          resolve(window.Autodesk);
          return;
        }

        // Load Forge Viewer CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css';
        document.head.appendChild(link);

        // Load Forge Viewer JS
        const script = document.createElement('script');
        script.src = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js';
        script.onload = () => resolve(window.Autodesk);
        script.onerror = () => reject(new Error('Failed to load Autodesk Forge Viewer'));
        document.head.appendChild(script);
      });
    };

    const initializeViewer = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if Forge credentials are configured
        if (!forgeService.hasCredentials()) {
          throw new Error('Forge credentials not configured. Please set up your Autodesk Forge API credentials first.');
        }

        await loadForgeViewer();
        
        if (!viewerRef.current) return;

        const options = {
          env: 'AutodeskProduction',
          api: 'derivativeV2',
          getAccessToken: async (onSuccess: any, onError: any) => {
            try {
              const token = await forgeService.getAccessToken();
              onSuccess(token, 3600);
            } catch (error) {
              console.error('Failed to get Forge access token:', error);
              onError(error);
            }
          }
        };

        window.Autodesk.Viewing.Initializer(options, async () => {
          const viewerDiv = viewerRef.current;
          if (!viewerDiv) return;

          const viewer3D = new window.Autodesk.Viewing.GuiViewer3D(viewerDiv);
          
          const startedCode = viewer3D.start();
          if (startedCode > 0) {
            console.error('Failed to create a Viewer: WebGL not supported.');
            setError('WebGL not supported in your browser. Please use a modern browser with WebGL support.');
            return;
          }

          setViewer(viewer3D);

          // For demonstration, show instructions for proper implementation
          setError('Model translation required. To view CAD models, you need to: 1) Upload the file to Autodesk Forge, 2) Translate it to SVF format, 3) Load the translated model URN.');
          setIsLoading(false);

          // In a real implementation, you would:
          // 1. Upload the file to Forge using Data Management API
          // 2. Submit a translation job to convert to SVF
          // 3. Get the translated model URN
          // 4. Load the model using viewer3D.loadDocumentNode()
        });

      } catch (error) {
        console.error('Error initializing Forge Viewer:', error);
        setError(error instanceof Error ? error.message : 'Failed to initialize Forge Viewer');
        setIsLoading(false);
      }
    };

    initializeViewer();

    return () => {
      if (viewer) {
        viewer.tearDown();
      }
    };
  }, [fileUrl, fileName, fileType]);

  const handleResetView = () => {
    if (viewer) {
      viewer.fitToView();
    }
  };

  const handleZoomIn = () => {
    if (viewer) {
      viewer.navigation.setZoomTowardsPivot(true);
      viewer.navigation.zoom(1.2);
    }
  };

  const handleZoomOut = () => {
    if (viewer) {
      viewer.navigation.setZoomTowardsPivot(true);
      viewer.navigation.zoom(0.8);
    }
  };

  return (
    <Card className="w-full h-[500px]">
      <CardContent className="p-0 h-full relative">
        {/* Header Controls */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Back to Preview
          </Button>
          <Badge variant="secondary">Autodesk Forge</Badge>
        </div>
        
        {/* Viewer Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button variant="outline" size="sm" onClick={handleResetView} title="Reset View" disabled={!viewer || error}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn} title="Zoom In" disabled={!viewer || error}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut} title="Zoom Out" disabled={!viewer || error}>
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>

        {/* Model Info */}
        {modelInfo && (
          <div className="absolute bottom-4 right-4 z-10 bg-background/95 backdrop-blur rounded-md p-3 text-xs max-w-xs">
            <div className="flex items-center mb-2">
              <Move3d className="h-4 w-4 mr-2" />
              <span className="font-medium">Model Info</span>
            </div>
            <div className="space-y-1">
              <div><strong>Format:</strong> {fileType.toUpperCase()}</div>
              <div><strong>File:</strong> {fileName}</div>
              <div><strong>Viewer:</strong> Autodesk Forge</div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-20">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Initializing Autodesk Forge Viewer...</p>
              <p className="text-xs text-muted-foreground mt-1">Loading precision CAD viewer</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 z-20">
            <div className="text-center max-w-md p-4">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
              <p className="text-destructive font-medium">Forge Viewer Setup Required</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">{error}</p>
              
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-left">
                  <p className="text-xs text-blue-800 font-medium mb-2">Complete Setup Steps:</p>
                  <ol className="text-xs text-blue-700 space-y-1">
                    <li>1. Configure Forge credentials in setup</li>
                    <li>2. Implement file upload to Forge</li>
                    <li>3. Set up model translation service</li>
                    <li>4. Load translated model URN</li>
                  </ol>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onClose}
                  >
                    Use Basic Viewer
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => window.open('/forge-setup', '_blank')}
                  >
                    Setup Forge
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Forge Viewer Container */}
        <div 
          ref={viewerRef} 
          className="w-full h-full"
          style={{ display: error ? 'none' : 'block' }}
        />

        {/* Controls Help */}
        <div className="absolute bottom-4 left-4 z-10 bg-background/90 rounded-md p-2">
          <p className="text-xs text-muted-foreground">
            Left-click: Orbit • Right-click: Pan • Scroll: Zoom • Double-click: Focus
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
