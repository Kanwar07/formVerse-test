import React, { Suspense, useState, useCallback, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Center, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  RotateCcw, 
  Download,
  AlertCircle, 
  Eye, 
  EyeOff,
  Grid3X3,
  Info,
  Sparkles
} from 'lucide-react';
import { LoadingIndicator3D } from './LoadingIndicator3D';
import { ModelViewerErrorBoundary } from '../common/ModelViewerErrorBoundary';
import { useToast } from '@/hooks/use-toast';

// Enhanced CAD model loader with proper error handling
import { EnhancedCADLoader, LoadedCADModel } from './EnhancedCADLoader';

interface UnifiedCADViewerProps {
  fileUrl: string;
  fileName: string;
  fileType?: string;
  onClose?: () => void;
  className?: string;
  width?: number;
  height?: number;
  showControls?: boolean;
  autoRotate?: boolean;
  videoUrl?: string; // Add video URL for AI-generated models
}

interface ModelInfo {
  vertices: number;
  faces: number;
  materials: number;
  format: string;
  fileSize?: string;
}

// Safe Model Renderer Component with consistent scaling
const SafeModelRenderer = ({ 
  model, 
  wireframeMode = false,
  onBoundsCalculated 
}: { 
  model: LoadedCADModel; 
  wireframeMode?: boolean;
  onBoundsCalculated?: (bounds: any) => void;
}) => {
  // Comprehensive validation to prevent "lov" property errors
  const validatedModel = useMemo(() => {
    if (!model || !model.geometry || !model.materials) {
      console.error('SafeModelRenderer: Invalid model data');
      return null;
    }

    // Validate geometry
    if (!model.geometry.attributes || !model.geometry.attributes.position) {
      console.error('SafeModelRenderer: Geometry missing position attribute');
      return null;
    }

    // Create safe geometry clone
    const safeGeometry = model.geometry.clone();
    
    // Ensure normals exist
    if (!safeGeometry.attributes.normal) {
      safeGeometry.computeVertexNormals();
    }
    
    // Clean up potentially problematic properties that cause React Three Fiber errors
    delete (safeGeometry as any).lov;
    delete (safeGeometry as any)._listeners;
    delete (safeGeometry as any).__reactInternalInstance;
    
    // Validate materials
    const safeMaterials = model.materials.filter(mat => mat && typeof mat === 'object').map(mat => {
      const safeMaterial = mat.clone();
      
      // Clean up potentially problematic properties
      delete (safeMaterial as any).lov;
      delete (safeMaterial as any)._listeners;
      delete (safeMaterial as any).__reactInternalInstance;
      
      // Ensure proper React Three Fiber compatibility
      safeMaterial.needsUpdate = true;
      safeMaterial.side = THREE.DoubleSide;
      
      return safeMaterial;
    });

    if (safeMaterials.length === 0) {
      safeMaterials.push(new THREE.MeshStandardMaterial({ 
        color: 0x888888,
        side: THREE.DoubleSide
      }));
    }

    return {
      geometry: safeGeometry,
      materials: safeMaterials
    };
  }, [model]);

  // Calculate model bounds and apply consistent scaling
  const scaledModel = useMemo(() => {
    if (!validatedModel) return null;

    // Create a temporary mesh to calculate bounds
    const tempMesh = new THREE.Mesh(validatedModel.geometry, validatedModel.materials[0]);
    const box = new THREE.Box3().setFromObject(tempMesh);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);

    // Normalize to consistent size (target: 2 units max dimension)
    const targetSize = 2;
    const scaleFactor = maxDimension > 0 ? targetSize / maxDimension : 1;

    // Report bounds for camera positioning
    if (onBoundsCalculated) {
      onBoundsCalculated({
        center,
        size,
        maxDimension: targetSize, // Use normalized size
        scaleFactor
      });
    }

    return {
      ...validatedModel,
      scaleFactor,
      center: center.clone().negate().multiplyScalar(scaleFactor)
    };
  }, [validatedModel, onBoundsCalculated]);

  if (!scaledModel) {
    // Fallback geometry when model is invalid
    return (
      <Center>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ff6b6b" transparent opacity={0.7} />
        </mesh>
      </Center>
    );
  }

  // Use React Three Fiber's declarative approach with consistent scaling
  return (
    <group
      scale={[scaledModel.scaleFactor, scaledModel.scaleFactor, scaledModel.scaleFactor]}
      position={[scaledModel.center.x, scaledModel.center.y, scaledModel.center.z]}
    >
      <mesh 
        geometry={scaledModel.geometry}
        material={wireframeMode 
          ? new THREE.MeshBasicMaterial({ 
              color: 0x00d4ff, 
              wireframe: true, 
              transparent: true, 
              opacity: 0.8,
              side: THREE.DoubleSide
            })
          : scaledModel.materials[0]
        }
        castShadow
        receiveShadow
      />
    </group>
  );
};

// Loading fallback component
const LoadingFallback = () => (
  <Center>
    <Html center>
      <div className="flex flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground mt-2">Loading 3D model...</p>
      </div>
    </Html>
  </Center>
);

// Error fallback component
const ErrorFallback = ({ error, onRetry }: { error: string; onRetry?: () => void }) => (
  <Center>
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 bg-background/90 rounded-lg border border-destructive/20">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="font-semibold text-destructive mb-2">Failed to Load 3D Model</h3>
        <p className="text-sm text-muted-foreground text-center mb-4 max-w-xs">
          {error}
        </p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </div>
    </Html>
  </Center>
);

export const UnifiedCADViewer: React.FC<UnifiedCADViewerProps> = ({
  fileUrl,
  fileName,
  fileType,
  onClose,
  className = "",
  width = 800,
  height = 600,
  showControls = true,
  autoRotate = false,
  videoUrl
}) => {
  const [model, setModel] = useState<LoadedCADModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([4, 4, 4]);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number]>([0, 0, 0]);
  
  const { toast } = useToast();
  const orbitControlsRef = useRef<any>(null);

  // Detect file type from URL or filename
  const detectedFileType = useMemo(() => {
    if (fileType) return fileType;
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  }, [fileType, fileName]);

  // Load model with comprehensive error handling
  const loadModel = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('UnifiedCADViewer: Starting to load model', { fileUrl, fileName, detectedFileType });
      
      // Use the EnhancedCADLoader with progress tracking
      const loadedModel = await EnhancedCADLoader.loadModel(
        fileUrl, 
        fileName,
        (progress) => {
          console.log(`Loading progress: ${progress.progress}% - ${progress.stage}`);
        }
      );

      console.log('UnifiedCADViewer: Model loaded successfully', loadedModel);

      // Extract model info
      const info: ModelInfo = {
        vertices: loadedModel.metadata?.vertices || 0,
        faces: loadedModel.metadata?.faces || 0,
        materials: loadedModel.materials.length,
        format: loadedModel.metadata?.format || detectedFileType.toUpperCase(),
        fileSize: loadedModel.metadata?.fileSize ? `${(loadedModel.metadata.fileSize / 1024).toFixed(1)} KB` : undefined
      };

      setModel(loadedModel);
      setModelInfo(info);
      setLoading(false);

      toast({
        title: "3D Model Loaded",
        description: `${info.format} file with ${info.vertices.toLocaleString()} vertices`,
      });

    } catch (err) {
      console.error('UnifiedCADViewer: Failed to load model', err);
      let errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      
      // Provide more user-friendly error messages
      if (errorMessage.includes('format is not supported')) {
        errorMessage = `Unable to determine file format for "${fileName}". The model may be in an unsupported format or missing a file extension.`;
      } else if (errorMessage.includes('Failed to fetch')) {
        errorMessage = `Unable to load the 3D model file. Please check if the file is accessible.`;
      } else if (errorMessage.includes('Invalid file URL')) {
        errorMessage = `The model file URL is invalid or inaccessible.`;
      }
      
      setError(errorMessage);
      setLoading(false);

      toast({
        variant: "destructive",
        title: "Failed to Load 3D Model",
        description: errorMessage,
      });
    }
  }, [fileUrl, fileName, detectedFileType, toast]);

  // Load model on mount or when dependencies change
  React.useEffect(() => {
    if (fileUrl && fileName) {
      loadModel();
    }
  }, [loadModel]);

  // Handle model bounds calculation for optimal camera positioning
  const handleBoundsCalculated = useCallback((bounds: any) => {
    const { center, maxDimension } = bounds;
    
    // Calculate optimal camera distance for consistent framing
    const distance = Math.max(maxDimension * 1.8, 3); // Minimum distance of 3 units
    
    // Set isometric view position for professional CAD visualization
    const offset = distance * 0.7071; // 45-degree angles
    const newCameraPos: [number, number, number] = [
      center.x + offset,
      center.y + offset, 
      center.z + offset
    ];
    
    const newTarget: [number, number, number] = [center.x, center.y, center.z];
    
    setCameraPosition(newCameraPos);
    setCameraTarget(newTarget);
    
    // Update orbit controls if available
    if (orbitControlsRef.current) {
      orbitControlsRef.current.target.set(...newTarget);
      orbitControlsRef.current.update();
    }
  }, []);

  // Reset view handler
  const handleResetView = useCallback(() => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.reset();
      // Reset to calculated optimal position
      orbitControlsRef.current.target.set(...cameraTarget);
      orbitControlsRef.current.update();
      toast({
        title: "View Reset",
        description: "Camera position has been reset",
      });
    }
  }, [toast, cameraTarget]);

  // Download handler
  const handleDownload = useCallback(() => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
      toast({
        title: "Download Started",
        description: `Downloading ${fileName}`,
      });
    }
  }, [fileUrl, fileName, toast]);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-lg font-semibold">{fileName}</CardTitle>
          {modelInfo && (
            <Badge variant="secondary" className="text-xs">
              {modelInfo.format}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-1">
          {showControls && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setWireframeMode(!wireframeMode)}
                className="h-8 w-8 p-0"
              >
                {wireframeMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetView}
                className="h-8 w-8 p-0"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="h-8 w-8 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div 
          className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
          style={{ width, height }}
        >
          <ModelViewerErrorBoundary
            fallback={
              <div className="flex items-center justify-center h-full">
                <ErrorFallback 
                  error="3D viewer crashed. Please try reloading the page." 
                  onRetry={loadModel}
                />
              </div>
            }
          >
            <Canvas
              camera={{ 
                position: cameraPosition, 
                fov: 50,
                near: 0.1,
                far: 100
              }}
              onCreated={({ gl }) => {
                gl.setClearColor('#f8f9fa');
                gl.shadowMap.enabled = true;
                gl.shadowMap.type = THREE.PCFSoftShadowMap;
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1;
              }}
            >
              <Suspense fallback={<LoadingFallback />}>
                {/* Environment and Lighting */}
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

                {/* Grid */}
                {showGrid && (
                  <gridHelper args={[20, 20, '#888888', '#cccccc']} />
                )}

                {/* Model Rendering */}
                {loading && <LoadingFallback />}
                {error && <ErrorFallback error={error} onRetry={loadModel} />}
                {model && !loading && !error && (
                  <SafeModelRenderer 
                    model={model} 
                    wireframeMode={wireframeMode}
                    onBoundsCalculated={handleBoundsCalculated}
                  />
                )}

                {/* Controls */}
                <OrbitControls
                  ref={orbitControlsRef}
                  target={cameraTarget}
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  minDistance={1}
                  maxDistance={20}
                  enableDamping={true}
                  dampingFactor={0.05}
                  autoRotate={autoRotate}
                  autoRotateSpeed={0.5}
                />
              </Suspense>
            </Canvas>
          </ModelViewerErrorBoundary>

          {/* Model Info Overlay */}
          {modelInfo && showControls && (
            <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-md p-3 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4" />
                <span className="font-medium">Model Info</span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Vertices: {modelInfo.vertices.toLocaleString()}</div>
                <div>Faces: {modelInfo.faces.toLocaleString()}</div>
                <div>Materials: {modelInfo.materials}</div>
                {modelInfo.fileSize && <div>Size: {modelInfo.fileSize}</div>}
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading {detectedFileType.toUpperCase()} model...</p>
              </div>
            </div>
          )}

          {/* Error Fallback */}
          {error && !loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
              <div className="flex flex-col items-center space-y-3 p-4 text-center">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <div className="space-y-1">
                  <p className="font-medium text-destructive">3D Preview Unavailable</p>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    {error.includes('format') 
                      ? 'This model format is not supported for 3D preview.'
                      : 'Unable to load 3D preview. The model file may be inaccessible or corrupted.'
                    }
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadModel}
                  className="mt-2"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Video Display for AI-Generated Models */}
      {videoUrl && (
        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Generation Process Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-cover"
                  poster="/placeholder.svg"
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Watch how your image was transformed into a 3D model using CADQUA AI.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  );
};
