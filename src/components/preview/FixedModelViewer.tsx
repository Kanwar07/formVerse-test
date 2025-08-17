import React, { useState, useRef, Suspense, useCallback, useEffect } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Center } from '@react-three/drei';
import { GLTFLoader } from 'three-stdlib';
import { STLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  RotateCcw, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Play,
  Pause,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FixedModelViewerProps {
  fileUrl: string;
  fileName: string;
  onClose?: () => void;
  className?: string;
}

// Auto-fit camera component
const CameraController = ({ 
  onAutoFit 
}: { 
  onAutoFit: (fitCamera: (object: THREE.Object3D) => void) => void;
}) => {
  const { camera, controls } = useThree();
  const controlsRef = useRef<any>(controls);
  
  const fitCameraToObject = useCallback((object: THREE.Object3D) => {
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // Get both horizontal and vertical extents for proper aspect ratio handling
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 50;
    const aspect = camera instanceof THREE.PerspectiveCamera ? camera.aspect : 1;
    
    // Calculate distance needed to fit both width and height in view
    // Consider the largest dimension relative to camera's field of view and aspect ratio
    const fovRad = (fov * Math.PI) / 180;
    const vFov = fovRad;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    
    // Calculate distances needed for vertical and horizontal fit
    const distanceVFit = (size.y / 2) / Math.tan(vFov / 2);
    const distanceHFit = (Math.max(size.x, size.z) / 2) / Math.tan(hFov / 2);
    
    // Use the larger distance to ensure everything fits, plus padding
    const paddingFactor = 1.2; // 20% padding around the model
    const requiredDistance = Math.max(distanceVFit, distanceHFit, maxDim) * paddingFactor;
    
    // Position camera adaptively based on model proportions
    let cameraPosition;
    if (size.y > size.x && size.y > size.z) {
      // Tall model - position more to the side
      cameraPosition = new THREE.Vector3(
        center.x + requiredDistance * 0.8,
        center.y + requiredDistance * 0.4,
        center.z + requiredDistance * 0.8
      );
    } else if (size.x > size.z) {
      // Wide model - position more above
      cameraPosition = new THREE.Vector3(
        center.x + requiredDistance * 0.6,
        center.y + requiredDistance * 0.8,
        center.z + requiredDistance * 0.6
      );
    } else {
      // Deep or balanced model - use diagonal view
      cameraPosition = new THREE.Vector3(
        center.x + requiredDistance * 0.7,
        center.y + requiredDistance * 0.7,
        center.z + requiredDistance * 0.7
      );
    }
    
    camera.position.copy(cameraPosition);
    camera.lookAt(center);
    
    // Update controls with model-relative distances
    if (controlsRef.current) {
      controlsRef.current.target.copy(center);
      controlsRef.current.minDistance = maxDim * 0.05; // Closer minimum
      controlsRef.current.maxDistance = maxDim * 15; // Further maximum
      controlsRef.current.update();
    }
    
    console.log('Auto-fitted camera to object:', { 
      center, 
      size, 
      requiredDistance, 
      cameraPosition,
      distanceVFit,
      distanceHFit 
    });
  }, [camera]);
  
  useEffect(() => {
    onAutoFit(fitCameraToObject);
  }, [onAutoFit, fitCameraToObject]);
  
  return null;
};

// Enhanced model component with auto-fit
const ModelWithAutoFit = ({ 
  fileUrl, 
  fileName,
  wireframe = false,
  onModelLoaded 
}: { 
  fileUrl: string; 
  fileName: string; 
  wireframe?: boolean;
  onModelLoaded?: (object: THREE.Object3D) => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scene } = useThree();
  
  // Determine file type
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
  
  console.log('ModelWithAutoFit: Loading', fileUrl, 'Type:', fileExtension);

  // Auto-fit effect when model is loaded and added to scene
  useEffect(() => {
    if (meshRef.current && onModelLoaded) {
      onModelLoaded(meshRef.current);
    }
  }, [onModelLoaded]);

  try {
    // Load model based on file type using React Three Fiber's useLoader
    if (fileExtension === 'gltf' || fileExtension === 'glb') {
      const gltf = useLoader(GLTFLoader, fileUrl);
      console.log('GLTF loaded successfully:', gltf);
      
      if (gltf.scene) {
        const clonedScene = gltf.scene.clone();
        
        useEffect(() => {
          if (onModelLoaded && clonedScene) {
            onModelLoaded(clonedScene);
          }
        }, [clonedScene, onModelLoaded]);
        
        return (
          <Center>
            <primitive 
              ref={meshRef}
              object={clonedScene}
              scale={[1, 1, 1]}
            />
          </Center>
        );
      }
    }
    
    if (fileExtension === 'stl') {
      const geometry = useLoader(STLLoader, fileUrl);
      console.log('STL loaded successfully:', geometry);
      
      const mesh = (
        <Center>
          <mesh ref={meshRef}>
            <primitive object={geometry} />
            <meshStandardMaterial 
              color={wireframe ? "#00d4ff" : "#888888"} 
              wireframe={wireframe}
              metalness={0.1}
              roughness={0.3}
            />
          </mesh>
        </Center>
      );
      
      useEffect(() => {
        if (meshRef.current && onModelLoaded) {
          onModelLoaded(meshRef.current);
        }
      }, [onModelLoaded]);
      
      return mesh;
    }
    
    if (fileExtension === 'obj') {
      const obj = useLoader(OBJLoader, fileUrl);
      console.log('OBJ loaded successfully:', obj);
      
      const clonedObj = obj.clone();
      
      useEffect(() => {
        if (onModelLoaded && clonedObj) {
          onModelLoaded(clonedObj);
        }
      }, [clonedObj, onModelLoaded]);
      
      return (
        <Center>
          <primitive 
            ref={meshRef}
            object={clonedObj}
            scale={[1, 1, 1]}
          />
        </Center>
      );
    }
    
  } catch (error) {
    console.error('Model loading error:', error);
  }

  // Fallback for unsupported formats
  const colors = {
    ply: '#ffff88',
    step: '#ff88ff',
    iges: '#88ffff',
    default: '#888888'
  };
  
  const color = colors[fileExtension as keyof typeof colors] || colors.default;
  
  const fallbackMesh = (
    <Center>
      <mesh ref={meshRef}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial 
          color={wireframe ? "#00d4ff" : color}
          wireframe={wireframe}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>
    </Center>
  );
  
  useEffect(() => {
    if (meshRef.current && onModelLoaded) {
      onModelLoaded(meshRef.current);
    }
  }, [onModelLoaded]);
  
  return fallbackMesh;
};

// Error boundary component
const ModelErrorBoundary = ({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode; 
  fallback: React.ReactNode;
}) => {
  const [hasError, setHasError] = useState(false);
  
  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Model render error caught:', error);
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  if (hasError) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export const FixedModelViewer = ({ 
  fileUrl, 
  fileName,
  onClose,
  className
}: FixedModelViewerProps) => {
  const [wireframeMode, setWireframeMode] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [autoFitCamera, setAutoFitCamera] = useState<((object: THREE.Object3D) => void) | null>(null);
  
  const controlsRef = useRef<any>(null);
  const { toast } = useToast();

  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
    // Re-trigger auto-fit after reset
    if (autoFitCamera) {
      setTimeout(() => {
        // Find the model in the scene and auto-fit to it
        const scene = controlsRef.current?.object?.parent;
        if (scene) {
          scene.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh || child.type === 'Group') {
              autoFitCamera(child);
              return;
            }
          });
        }
      }, 50);
    }
  };

  const handleAutoFit = useCallback((fitFunction: (object: THREE.Object3D) => void) => {
    setAutoFitCamera(() => fitFunction);
  }, []);

  const handleModelLoaded = useCallback((object: THREE.Object3D) => {
    if (autoFitCamera) {
      // Small delay to ensure the model is fully rendered
      setTimeout(() => {
        autoFitCamera(object);
      }, 100);
    }
  }, [autoFitCamera]);

  const fileExtension = fileName.split('.').pop()?.toUpperCase() || 'UNKNOWN';

  const FallbackModel = () => (
    <Center>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff6666" />
      </mesh>
    </Center>
  );

  return (
    <Card className={`w-full h-[600px] flex flex-col ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg truncate max-w-xs" title={fileName}>
              {fileName}
            </CardTitle>
            <Badge variant="secondary">{fileExtension}</Badge>
            <Badge variant="outline" className="text-xs text-green-600">
              Auto-Fit Model
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWireframeMode(!wireframeMode)}
              className={wireframeMode ? 'bg-primary/10' : ''}
              title="Toggle wireframe mode"
            >
              {wireframeMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRotate(!autoRotate)}
              className={autoRotate ? 'bg-primary/10' : ''}
              title="Toggle auto rotation"
            >
              {autoRotate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInfo(!showInfo)}
              className={showInfo ? 'bg-primary/10' : ''}
              title="Toggle info panel"
            >
              <Info className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetView}
              title="Reset and fit camera view"
            >
              <RotateCcw className="h-4 w-4" />
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
        {/* Info panel */}
        {showInfo && (
          <div className="absolute top-4 left-4 z-10 bg-background/95 backdrop-blur rounded-lg p-3 text-sm max-w-xs border shadow-lg">
            <div className="flex items-center mb-2">
              <Info className="h-4 w-4 mr-2" />
              <span className="font-medium">Auto-Fit Model Viewer</span>
            </div>
            <div className="space-y-1">
              <div><strong>Format:</strong> {fileExtension}</div>
              <div><strong>File:</strong> {fileName}</div>
              <div className="text-xs text-muted-foreground mt-2">
                Camera automatically fits to show entire model. Use Reset button to re-fit.
              </div>
            </div>
          </div>
        )}

        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [10, 10, 10], fov: 45 }}
          onCreated={({ gl }) => {
            gl.setClearColor('#f8f9fa');
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          <ModelErrorBoundary fallback={<FallbackModel />}>
            <Suspense fallback={
              <Center>
                <mesh>
                  <sphereGeometry args={[0.5, 16, 16]} />
                  <meshBasicMaterial color="#888888" transparent opacity={0.5} />
                </mesh>
              </Center>
            }>
              {/* Camera controller for auto-fit */}
              <CameraController onAutoFit={handleAutoFit} />
              
              {/* Environment and lighting */}
              <Environment preset="studio" />
              
              <ambientLight intensity={0.4} />
              <directionalLight
                position={[10, 10, 5]} 
                intensity={0.8}
                castShadow
              />
              <directionalLight position={[-5, 5, 5]} intensity={0.4} />
              
              {/* Model with auto-fit */}
              <ModelWithAutoFit 
                fileUrl={fileUrl}
                fileName={fileName}
                wireframe={wireframeMode}
                onModelLoaded={handleModelLoaded}
              />
              
              {/* Controls */}
              <OrbitControls
                ref={controlsRef}
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={0.1}
                maxDistance={1000}
                enableDamping={true}
                dampingFactor={0.05}
                autoRotate={autoRotate}
                autoRotateSpeed={1}
              />
            </Suspense>
          </ModelErrorBoundary>
        </Canvas>

        {/* Controls info */}
        <div className="absolute bottom-4 left-4 z-10 bg-background/90 rounded-md p-2">
          <p className="text-xs text-muted-foreground">
            Left-click + drag: Rotate • Right-click + drag: Pan • Scroll: Zoom • Reset: Auto-fit
          </p>
        </div>

        {/* File type indicator */}
        <div className="absolute bottom-4 right-4 z-10 bg-background/90 rounded-md p-2">
          <p className="text-xs text-muted-foreground">
            Auto-Fit {fileExtension} Model
          </p>
        </div>
      </CardContent>
    </Card>
  );
};