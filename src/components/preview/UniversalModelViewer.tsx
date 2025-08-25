import React, { useState, useRef, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, GizmoHelper, GizmoViewport, Center } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Loader2, 
  RotateCcw, 
  Info, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Grid3X3,
  Download,
  Play,
  Pause,
  Settings,
  FileText,
  ImageUp
} from 'lucide-react';
import { UniversalCADLoader, LoadedCADModel, LoadProgress } from './UniversalCADLoader';
import { SafeModelRenderer } from './SafeModelRenderer';
import { LoadingIndicator3D } from './LoadingIndicator3D';
import { useToast } from '@/hooks/use-toast';

interface UniversalModelViewerProps {
  fileUrl: string;
  fileName: string;
  onClose?: () => void;
  className?: string;
  autoRotate?: boolean;
  showGrid?: boolean;
  showGizmo?: boolean;
  background?: 'white' | 'grey' | 'black' | 'custom';
  backgroundImage?: string;
  onBackgroundChange?: (bg: 'white' | 'grey' | 'black' | 'custom') => void;
  onBackgroundImageUpload?: (imageUrl: string) => void;
}

// Use SafeModelRenderer instead of inline ModelRenderer
const ModelRenderer = ({ 
  model, 
  wireframeMode, 
  autoRotate 
}: { 
  model: LoadedCADModel; 
  wireframeMode: boolean; 
  autoRotate: boolean;
}) => {
  return (
    <SafeModelRenderer 
      model={model}
      wireframeMode={wireframeMode}
      autoRotate={autoRotate}
    />
  );
};

export const UniversalModelViewer = ({ 
  fileUrl, 
  fileName,
  onClose,
  className,
  autoRotate: initialAutoRotate = false,
  showGrid: initialShowGrid = true,
  showGizmo: initialShowGizmo = true,
  background = 'white',
  backgroundImage,
  onBackgroundChange,
  onBackgroundImageUpload
}: UniversalModelViewerProps) => {
  const [model, setModel] = useState<LoadedCADModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadProgress, setLoadProgress] = useState<LoadProgress>({ progress: 0, stage: 'Initializing' });
  
  // Viewer controls
  const [wireframeMode, setWireframeMode] = useState(false);
  const [autoRotate, setAutoRotate] = useState(initialAutoRotate);
  const [showGrid, setShowGrid] = useState(initialShowGrid);
  const [showGizmo, setShowGizmo] = useState(initialShowGizmo);
  const [showInfo, setShowInfo] = useState(true);
  
  const controlsRef = useRef<any>(null);
  const { toast } = useToast();

  // Load model on mount
  React.useEffect(() => {
    loadModel();
  }, [fileUrl, fileName]);

  const loadModel = useCallback(async () => {
    if (!fileUrl || !fileName) return;

    setLoading(true);
    setError(null);
    setModel(null);
    setLoadProgress({ progress: 0, stage: 'Starting load' });

    try {
      console.log('UniversalModelViewer: Loading model', { fileUrl, fileName });
      
      const loadedModel = await UniversalCADLoader.loadModel(
        fileUrl, 
        fileName, 
        (progress) => {
          console.log('Load progress:', progress);
          setLoadProgress(progress);
        }
      );

      console.log('UniversalModelViewer: Model loaded successfully', loadedModel);
      setModel(loadedModel);
      setLoading(false);

      // Show success toast
      toast({
        title: "Model loaded successfully",
        description: `${loadedModel.metadata?.format} file with ${loadedModel.metadata?.vertices.toLocaleString()} vertices`,
      });

    } catch (error) {
      console.error('UniversalModelViewer: Failed to load model:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      setLoading(false);

      // Show error toast
      toast({
        title: "Failed to load model",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [fileUrl, fileName, toast]);

  const resetView = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  const exportModel = useCallback(() => {
    if (!model) return;
    
    // Placeholder for export functionality
    toast({
      title: "Export feature",
      description: "Model export functionality will be implemented soon",
    });
  }, [model, toast]);

  const retryLoad = useCallback(() => {
    loadModel();
  }, [loadModel]);

  return (
    <Card className={`w-full h-[600px] flex flex-col ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg truncate max-w-xs" title={fileName}>
              {fileName}
            </CardTitle>
            {model?.metadata && (
              <Badge variant="secondary">{model.metadata.format}</Badge>
            )}
            {loading && (
              <Badge variant="outline" className="animate-pulse">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Loading
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* View controls */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWireframeMode(!wireframeMode)}
              className={wireframeMode ? 'bg-primary/10' : ''}
              disabled={loading || !!error}
              title="Toggle wireframe mode"
            >
              {wireframeMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRotate(!autoRotate)}
              className={autoRotate ? 'bg-primary/10' : ''}
              disabled={loading || !!error}
              title="Toggle auto rotation"
            >
              {autoRotate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
              className={showGrid ? 'bg-primary/10' : ''}
              disabled={loading || !!error}
              title="Toggle grid"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInfo(!showInfo)}
              className={showInfo ? 'bg-primary/10' : ''}
              disabled={loading || !!error}
              title="Toggle model info"
            >
              <Info className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetView}
              disabled={loading || !!error}
              title="Reset camera view"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            {/* Background controls - right after main controls */}
            <div className="flex items-center gap-1 ml-2 pl-2 border-l">
              {[
                { value: 'white', label: 'W', bgColor: 'bg-white border border-border', textColor: 'text-black' },
                { value: 'grey', label: 'G', bgColor: 'bg-muted', textColor: 'text-foreground' },
                { value: 'black', label: 'B', bgColor: 'bg-black', textColor: 'text-white' }
              ].map(({ value, label, bgColor, textColor }) => (
                <Button
                  key={value}
                  variant="outline"
                  size="sm"
                  onClick={() => onBackgroundChange?.(value as any)}
                  className={`w-8 h-8 p-0 ${bgColor} ${textColor} ${
                    background === value ? 'ring-2 ring-primary' : ''
                  }`}
                  disabled={loading || !!error || !onBackgroundChange}
                  title={`${value.charAt(0).toUpperCase() + value.slice(1)} Background`}
                >
                  {label}
                </Button>
              ))}
              
              {/* Custom Background Upload */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && onBackgroundImageUpload && onBackgroundChange) {
                      const imageUrl = URL.createObjectURL(file);
                      onBackgroundImageUpload(imageUrl);
                      onBackgroundChange('custom');
                    }
                    e.target.value = '';
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={loading || !!error || !onBackgroundImageUpload}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-8 h-8 p-0 ${background === 'custom' && backgroundImage ? 'ring-2 ring-primary' : ''}`}
                  disabled={loading || !!error || !onBackgroundImageUpload}
                  title="Upload Background Image"
                >
                  <ImageUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportModel}
              disabled={loading || !!error || !model}
              title="Export model"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            {onClose && (
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>

        {/* Loading progress */}
        {loading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{loadProgress.stage}</span>
              <span className="text-sm font-medium">{Math.round(loadProgress.progress)}%</span>
            </div>
            <Progress value={loadProgress.progress} className="h-2" />
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-0 relative">
        {/* Model info panel */}
        {showInfo && model?.metadata && (
          <div className="absolute top-4 left-4 z-10 bg-background/95 backdrop-blur rounded-lg p-3 text-sm max-w-xs border shadow-lg">
            <div className="flex items-center mb-2">
              <FileText className="h-4 w-4 mr-2" />
              <span className="font-medium">Model Info</span>
            </div>
            <div className="space-y-1">
              <div><strong>Format:</strong> {model.metadata.format}</div>
              <div><strong>Vertices:</strong> {model.metadata.vertices.toLocaleString()}</div>
              <div><strong>Faces:</strong> {model.metadata.faces.toLocaleString()}</div>
              {model.metadata.boundingBox && (
                <div><strong>Size:</strong> {
                  `${model.metadata.boundingBox.max.x.toFixed(2)} × ${model.metadata.boundingBox.max.y.toFixed(2)} × ${model.metadata.boundingBox.max.z.toFixed(2)}`
                }</div>
              )}
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-20">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{loadProgress.stage}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Processing {fileName.split('.').pop()?.toUpperCase()} file
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 z-20">
            <div className="text-center max-w-md mx-4">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
              <p className="text-destructive font-medium mb-2">Failed to Load Model</p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={retryLoad}
                >
                  Retry Loading
                </Button>
                {onClose && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onClose}
                  >
                    Close
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [5, 5, 5], fov: 50 }}
          onCreated={({ gl }) => {
            // Set background color based on selection
            const bgColor = background === 'white' 
              ? '#ffffff'
              : background === 'grey'
              ? '#64748b'
              : background === 'black'
              ? '#000000'
              : '#f8f9fa';
            
            gl.setClearColor(bgColor);
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1;
          }}
          style={{
            background: background === 'custom' && backgroundImage 
              ? `url(${backgroundImage})` 
              : undefined,
            backgroundSize: background === 'custom' ? 'cover' : undefined,
            backgroundPosition: background === 'custom' ? 'center' : undefined,
            backgroundRepeat: background === 'custom' ? 'no-repeat' : undefined
          }}
        >
          <Suspense fallback={<LoadingIndicator3D />}>
            {/* Environment and lighting */}
            <Environment preset="studio" />
            
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[10, 10, 5]} 
              intensity={0.8}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <directionalLight position={[-10, -10, -5]} intensity={0.4} />
            <directionalLight position={[0, 10, 0]} intensity={0.3} />
            
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
            
            {/* 3D Model */}
            {model && (
              <SafeModelRenderer 
                model={model} 
                wireframeMode={wireframeMode}
                autoRotate={autoRotate}
              />
            )}
            
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
              autoRotate={false} // Handled by ModelRenderer
            />
            
            {/* Gizmo */}
            {showGizmo && (
              <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport 
                  axisColors={['#ff0000', '#00ff00', '#0000ff']} 
                />
              </GizmoHelper>
            )}
          </Suspense>
        </Canvas>

        {/* Controls info */}
        <div className="absolute bottom-4 left-4 z-10 bg-background/90 rounded-md p-2">
          <p className="text-xs text-muted-foreground">
            Left-click + drag: Rotate • Right-click + drag: Pan • Scroll: Zoom
          </p>
        </div>

        {/* Performance info */}
        {model?.metadata && (
          <div className="absolute bottom-4 right-4 z-10 bg-background/90 rounded-md p-2">
            <p className="text-xs text-muted-foreground">
              {model.metadata.vertices.toLocaleString()} vertices • {model.metadata.faces.toLocaleString()} faces
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};