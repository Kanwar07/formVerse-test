import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, RotateCcw, AlertCircle } from 'lucide-react';
import { Model3DRenderer } from './Model3DRenderer';
import { LoadingIndicator3D } from './LoadingIndicator3D';
import { CADAnalysisResult } from './CADAnalyzer';

interface ModelViewer3DProps {
  fileUrl: string;
  fileName: string;
  fileType: string;
  onClose: () => void;
  onModelInfo?: (info: any) => void;
}

export const ModelViewer3D = ({ fileUrl, fileName, fileType, onClose, onModelInfo }: ModelViewer3DProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelInfo, setModelInfo] = useState<any>(null);

  const handleGeometryLoaded = (analysis: CADAnalysisResult) => {
    console.log('ModelViewer3D: Analysis completed successfully');
    
    const vertices = analysis.vertices;
    const faces = analysis.faces;
    const size = analysis.scale;
    
    const info = {
      fileName,
      fileType: fileType.toUpperCase(),
      vertices: vertices.toLocaleString(),
      faces: faces.toLocaleString(),
      dimensions: `${size.x.toFixed(2)} × ${size.y.toFixed(2)} × ${size.z.toFixed(2)}`,
      isValid: vertices > 0 && faces > 0
    };
    
    setModelInfo(info);
    onModelInfo?.(info);
    setIsLoading(false);
    setError(null);
  };

  const handleLoadError = (errorMessage: string) => {
    console.error('ModelViewer3D: Load error:', errorMessage);
    setError(errorMessage);
    setIsLoading(false);
  };

  return (
    <Card className="w-full h-[500px]">
      <CardContent className="p-0 h-full relative">
        <div className="absolute top-4 left-4 z-10">
          <Button variant="outline" size="sm" onClick={onClose}>
            Back to Preview
          </Button>
        </div>
        
        <div className="absolute top-4 right-4 z-10">
          <Button variant="outline" size="sm" title="Reset View">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {modelInfo && (
          <div className="absolute bottom-4 right-4 z-10 bg-background/95 backdrop-blur rounded-md p-3 text-xs max-w-xs">
            <div className="space-y-1">
              <div><strong>Format:</strong> {modelInfo.fileType}</div>
              <div><strong>Vertices:</strong> {modelInfo.vertices}</div>
              <div><strong>Faces:</strong> {modelInfo.faces}</div>
              <div><strong>Size:</strong> {modelInfo.dimensions}</div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-20">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading CAD model...</p>
              <p className="text-xs text-muted-foreground mt-1">Processing {fileType.toUpperCase()} file</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 z-20">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
              <p className="text-destructive font-medium">Failed to Load Model</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                onClick={() => window.location.reload()}
              >
                Retry Loading
              </Button>
            </div>
          </div>
        )}

        <Canvas
          camera={{ position: [3, 3, 3], fov: 50 }}
          onCreated={({ gl }) => {
            gl.setClearColor('#f8f9fa');
          }}
        >
          <Suspense fallback={<LoadingIndicator3D />}>
            <Environment preset="studio" />
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <directionalLight position={[-10, -10, -5]} intensity={0.4} />
            
            <Model3DRenderer 
              fileUrl={fileUrl} 
              fileType={fileType}
              onAnalysisComplete={handleGeometryLoaded}
              onLoadError={handleLoadError}
            />
            
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={1}
              maxDistance={10}
            />
          </Suspense>
        </Canvas>

        <div className="absolute bottom-4 left-4 z-10 bg-background/90 rounded-md p-2">
          <p className="text-xs text-muted-foreground">
            Drag to rotate • Scroll to zoom • Right-click to pan
          </p>
        </div>
      </CardContent>
    </Card>
  );
};