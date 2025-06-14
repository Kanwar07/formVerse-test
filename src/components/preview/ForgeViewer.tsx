
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, RotateCcw, ZoomIn, ZoomOut, Move3d } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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
  const [modelInfo, setModelInfo] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load Autodesk Forge Viewer script
    const loadForgeViewer = () => {
      return new Promise((resolve, reject) => {
        if (window.Autodesk) {
          resolve(window.Autodesk);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js';
        script.onload = () => resolve(window.Autodesk);
        script.onerror = reject;
        document.head.appendChild(script);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css';
        document.head.appendChild(link);
      });
    };

    const initializeViewer = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await loadForgeViewer();
        
        if (!viewerRef.current) return;

        const options = {
          env: 'AutodeskProduction',
          api: 'derivativeV2',
          getAccessToken: async (onSuccess: any) => {
            // For demo purposes, we'll use a public access token
            // In production, this should come from your backend
            const token = await getForgeAccessToken();
            onSuccess(token, 3600);
          }
        };

        window.Autodesk.Viewing.Initializer(options, () => {
          const viewerDiv = viewerRef.current;
          if (!viewerDiv) return;

          const viewer3D = new window.Autodesk.Viewing.GuiViewer3D(viewerDiv);
          
          const startedCode = viewer3D.start();
          if (startedCode > 0) {
            console.error('Failed to create a Viewer: WebGL not supported.');
            setError('WebGL not supported in your browser');
            return;
          }

          setViewer(viewer3D);

          // Try to load the model
          loadModel(viewer3D);
        });

      } catch (error) {
        console.error('Error initializing Forge Viewer:', error);
        setError('Failed to initialize 3D viewer');
        setIsLoading(false);
      }
    };

    const getForgeAccessToken = async (): Promise<string> => {
      // In a real implementation, this would call your backend to get a Forge access token
      // For now, we'll simulate this or use a demo token
      throw new Error('Forge access token not configured. Please set up Forge credentials.');
    };

    const loadModel = async (viewer3D: any) => {
      try {
        // For demonstration, we'll show how to load a model
        // In production, you need to:
        // 1. Upload the file to Forge
        // 2. Convert it to SVF format
        // 3. Get the URN of the converted model
        
        // Since we don't have Forge credentials set up yet, we'll show an error
        throw new Error('Forge credentials not configured. Please set up Autodesk Forge API credentials.');
        
      } catch (error) {
        console.error('Error loading model:', error);
        setError(error instanceof Error ? error.message : 'Failed to load model');
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
          <Button variant="outline" size="sm" onClick={handleResetView} title="Reset View">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut} title="Zoom Out">
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
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-left">
                <p className="text-xs text-blue-800 font-medium mb-2">Setup Instructions:</p>
                <ol className="text-xs text-blue-700 space-y-1">
                  <li>1. Create Autodesk Forge app</li>
                  <li>2. Get Client ID & Secret</li>
                  <li>3. Configure access token endpoint</li>
                  <li>4. Set up file translation service</li>
                </ol>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                onClick={onClose}
              >
                Use Basic Viewer
              </Button>
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
