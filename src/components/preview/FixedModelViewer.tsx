import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
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

// Model component using React Three Fiber's useLoader
const ActualModel = ({ 
  fileUrl, 
  fileName,
  wireframe = false 
}: { 
  fileUrl: string; 
  fileName: string; 
  wireframe?: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Determine file type
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
  
  console.log('ActualModel: Loading', fileUrl, 'Type:', fileExtension);

  // Auto rotation
  React.useEffect(() => {
    if (!meshRef.current) return;
    
    let animationId: number;
    const animate = () => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.01;
        animationId = requestAnimationFrame(animate);
      }
    };
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  try {
    // Load model based on file type using React Three Fiber's useLoader
    if (fileExtension === 'gltf' || fileExtension === 'glb') {
      const gltf = useLoader(GLTFLoader, fileUrl);
      console.log('GLTF loaded successfully:', gltf);
      
      if (gltf.scene) {
        return (
          <Center>
            <primitive 
              ref={meshRef}
              object={gltf.scene.clone()}
              scale={[1, 1, 1]}
            />
          </Center>
        );
      }
    }
    
    if (fileExtension === 'stl') {
      const geometry = useLoader(STLLoader, fileUrl);
      console.log('STL loaded successfully:', geometry);
      
      return (
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
    }
    
    if (fileExtension === 'obj') {
      const obj = useLoader(OBJLoader, fileUrl);
      console.log('OBJ loaded successfully:', obj);
      
      return (
        <Center>
          <primitive 
            ref={meshRef}
            object={obj.clone()}
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
  
  return (
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
  
  const controlsRef = useRef<any>(null);
  const { toast } = useToast();

  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

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
              Full Model
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
              title="Reset camera view"
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
              <span className="font-medium">Full Model Rendering</span>
            </div>
            <div className="space-y-1">
              <div><strong>Format:</strong> {fileExtension}</div>
              <div><strong>File:</strong> {fileName}</div>
              <div className="text-xs text-muted-foreground mt-2">
                Loading actual 3D model geometry. May take a moment for complex models.
              </div>
            </div>
          </div>
        )}

        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [3, 3, 3], fov: 50 }}
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
              {/* Environment and lighting */}
              <Environment preset="studio" />
              
              <ambientLight intensity={0.4} />
              <directionalLight
                position={[10, 10, 5]} 
                intensity={0.8}
                castShadow
              />
              <directionalLight position={[-5, 5, 5]} intensity={0.4} />
              
              {/* Actual Model with error boundary */}
              <ActualModel 
                fileUrl={fileUrl}
                fileName={fileName}
                wireframe={wireframeMode}
              />
              
              {/* Controls */}
              <OrbitControls
                ref={controlsRef}
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={1}
                maxDistance={20}
                enableDamping={true}
                dampingFactor={0.05}
                autoRotate={true}
                autoRotateSpeed={1}
              />
            </Suspense>
          </ModelErrorBoundary>
        </Canvas>

        {/* Controls info */}
        <div className="absolute bottom-4 left-4 z-10 bg-background/90 rounded-md p-2">
          <p className="text-xs text-muted-foreground">
            Left-click + drag: Rotate • Right-click + drag: Pan • Scroll: Zoom
          </p>
        </div>

        {/* File type indicator */}
        <div className="absolute bottom-4 right-4 z-10 bg-background/90 rounded-md p-2">
          <p className="text-xs text-muted-foreground">
            Rendering {fileExtension} Model
          </p>
        </div>
      </CardContent>
    </Card>
  );
};