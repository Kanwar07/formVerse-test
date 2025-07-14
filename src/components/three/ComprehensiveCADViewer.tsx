import React, { useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Grid,
  GizmoHelper,
  GizmoViewport
} from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  RotateCcw, 
  Info, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Grid3X3,
  Download
} from 'lucide-react';
import { Model3DRenderer } from '../preview/Model3DRenderer';
import { LoadingIndicator3D } from '../preview/LoadingIndicator3D';
import { CADAnalysisResult } from '../preview/CADAnalyzer';


interface ComprehensiveCADViewerProps {
  fileUrl: string;
  fileName: string;
  fileType: string;
  onClose?: () => void;
}

export const ComprehensiveCADViewer = ({ 
  fileUrl, 
  fileName, 
  fileType, 
  onClose 
}: ComprehensiveCADViewerProps) => {
  const [analysis, setAnalysis] = useState<CADAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [showIssues, setShowIssues] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const controlsRef = useRef<any>(null);

  const handleAnalysisComplete = (result: CADAnalysisResult) => {
    setAnalysis(result);
    setIsLoading(false);
  };

  const handleLoadError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const exportModel = () => {
    // Placeholder for export functionality
    console.log('Export model functionality would go here');
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg">{fileName}</CardTitle>
            <Badge variant="secondary">{fileType.toUpperCase()}</Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWireframeMode(!wireframeMode)}
              className={wireframeMode ? 'bg-primary/10' : ''}
            >
              {wireframeMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
              className={showGrid ? 'bg-primary/10' : ''}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowIssues(!showIssues)}
              className={showIssues ? 'bg-destructive/10' : ''}
            >
              <AlertCircle className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={resetView}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={exportModel}>
              <Download className="h-4 w-4" />
            </Button>
            
            {onClose && (
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 relative">
        {/* Analysis Info Panel */}
        {analysis && (
          <div className="absolute top-4 left-4 z-10 bg-background/95 backdrop-blur rounded-md p-3 text-sm max-w-xs border">
            <div className="flex items-center mb-2">
              <Info className="h-4 w-4 mr-2" />
              <span className="font-medium">Model Analysis</span>
            </div>
            <div className="space-y-1">
              <div><strong>Vertices:</strong> {analysis.vertices.toLocaleString()}</div>
              <div><strong>Faces:</strong> {analysis.faces.toLocaleString()}</div>
              <div><strong>Volume:</strong> {analysis.volume.toFixed(2)} units³</div>
              <div><strong>Surface Area:</strong> {analysis.surfaceArea.toFixed(2)} units²</div>
              <div><strong>Dimensions:</strong> {analysis.scale.x.toFixed(2)} × {analysis.scale.y.toFixed(2)} × {analysis.scale.z.toFixed(2)}</div>
              {analysis.issues.length > 0 && (
                <div className="mt-2 pt-2 border-t">
                  <strong className="text-destructive">Issues:</strong>
                  {analysis.issues.map((issue, index) => (
                    <div key={index} className="text-xs text-muted-foreground">
                      • {issue.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-20">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Processing CAD model...</p>
              <p className="text-xs text-muted-foreground mt-1">Analyzing geometry and materials</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 z-20">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
              <p className="text-destructive font-medium">Failed to Load CAD Model</p>
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

        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [5, 5, 5], fov: 50 }}
          onCreated={({ gl }) => {
            gl.setClearColor('#f8f9fa');
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          <Suspense fallback={<LoadingIndicator3D />}>
            <Environment preset="studio" />
            
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[10, 10, 5]} 
              intensity={0.8}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <directionalLight position={[-10, -10, -5]} intensity={0.4} />
            
            {/* Grid */}
            {showGrid && (
              <Grid 
                args={[20, 20]} 
                cellSize={1} 
                cellThickness={0.5} 
                cellColor="#888888" 
                sectionSize={5} 
                sectionThickness={1}
                sectionColor="#444444"
                fadeDistance={30}
                fadeStrength={1}
                followCamera={false}
                infiniteGrid={true}
              />
            )}
            
            {/* CAD Model */}
            <Model3DRenderer 
              fileUrl={fileUrl} 
              fileType={fileType}
              onAnalysisComplete={handleAnalysisComplete}
              onLoadError={handleLoadError}
              wireframeMode={wireframeMode}
              showIssues={showIssues}
            />
            
            {/* Controls */}
            <OrbitControls
              ref={controlsRef}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={1}
              maxDistance={50}
              enableDamping={true}
              dampingFactor={0.05}
            />
            
            {/* Gizmo */}
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
              <GizmoViewport 
                axisColors={['#ff0000', '#00ff00', '#0000ff']} 
                labelColor="white"
              />
            </GizmoHelper>
          </Suspense>
        </Canvas>

        {/* Controls Info */}
        <div className="absolute bottom-4 left-4 z-10 bg-background/90 rounded-md p-2">
          <p className="text-xs text-muted-foreground">
            Left-click + drag: Rotate • Right-click + drag: Pan • Scroll: Zoom
          </p>
        </div>
      </CardContent>
    </Card>
  );
};