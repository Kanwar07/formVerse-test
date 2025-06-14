
import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Text, Environment } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface Model3DProps {
  fileUrl: string;
  fileType: string;
}

const Model3D = ({ fileUrl, fileType }: Model3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  let geometry;
  try {
    if (fileType.toLowerCase().includes('stl')) {
      geometry = useLoader(STLLoader, fileUrl);
    } else if (fileType.toLowerCase().includes('obj')) {
      const obj = useLoader(OBJLoader, fileUrl);
      geometry = obj.children[0]?.geometry;
    } else {
      throw new Error('Unsupported file format');
    }
  } catch (error) {
    console.error('Error loading 3D model:', error);
    return (
      <Text color="red" fontSize={0.5} position={[0, 0, 0]}>
        Error loading model
      </Text>
    );
  }

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color="#888888" />
    </mesh>
  );
};

interface ModelViewer3DProps {
  fileUrl: string;
  fileName: string;
  fileType: string;
  onClose: () => void;
}

export const ModelViewer3D = ({ fileUrl, fileName, fileType, onClose }: ModelViewer3DProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleModelLoad = () => {
    setIsLoading(false);
  };

  const handleModelError = (error: any) => {
    setError('Failed to load 3D model');
    setIsLoading(false);
    console.error('3D Model loading error:', error);
  };

  return (
    <Card className="w-full h-[500px]">
      <CardContent className="p-0 h-full relative">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Back to Preview
          </Button>
        </div>
        
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button variant="outline" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-20">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading 3D model...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 z-20">
            <div className="text-center">
              <p className="text-destructive font-medium">Failed to load 3D model</p>
              <p className="text-sm text-muted-foreground mt-1">
                The file format may not be supported or the file is corrupted
              </p>
            </div>
          </div>
        )}

        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          onCreated={() => handleModelLoad()}
        >
          <Suspense fallback={null}>
            <Environment preset="studio" />
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <directionalLight position={[-10, -10, -5]} intensity={0.4} />
            
            <Model3D 
              fileUrl={fileUrl} 
              fileType={fileType}
            />
            
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2}
              maxDistance={10}
            />
          </Suspense>
        </Canvas>

        <div className="absolute bottom-4 left-4 z-10 bg-background/90 rounded-md p-2">
          <p className="text-xs text-muted-foreground">
            Drag to rotate • Scroll to zoom • Right-click drag to pan
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
