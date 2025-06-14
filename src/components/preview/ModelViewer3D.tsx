
import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, Center } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
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
  const [modelLoaded, setModelLoaded] = useState(false);
  
  let geometry;
  
  try {
    if (fileType.toLowerCase().includes('stl')) {
      geometry = useLoader(STLLoader, fileUrl);
    } else if (fileType.toLowerCase().includes('obj')) {
      const obj = useLoader(OBJLoader, fileUrl);
      // Find the first mesh in the OBJ object
      const mesh = obj.children.find(child => child instanceof THREE.Mesh) as THREE.Mesh;
      geometry = mesh?.geometry || new THREE.BoxGeometry(2, 2, 2);
    } else {
      // Fallback to placeholder
      geometry = new THREE.BoxGeometry(2, 2, 2);
    }
  } catch (error) {
    console.error('Error loading 3D model:', error);
    geometry = new THREE.BoxGeometry(2, 2, 2);
  }

  useEffect(() => {
    if (geometry) {
      setModelLoaded(true);
      // Compute bounding box for proper centering
      geometry.computeBoundingBox();
    }
  }, [geometry]);
  
  useFrame(() => {
    if (meshRef.current && modelLoaded) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Center>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial 
          color="#888888" 
          metalness={0.1}
          roughness={0.4}
        />
      </mesh>
    </Center>
  );
};

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

  const handleModelLoad = () => {
    setIsLoading(false);
  };

  const handleModelError = (error: any) => {
    setError('Failed to load 3D model');
    setIsLoading(false);
    console.error('3D Model loading error:', error);
  };

  // Extract model information
  const extractModelInfo = async () => {
    try {
      console.log('Extracting model info for:', fileName, fileType);
      
      // Get file size from the URL (if it's a blob URL, we can get the original file size)
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      
      const info = {
        fileName,
        fileType,
        fileSize: blob.size,
        fileSizeFormatted: formatFileSize(blob.size),
        lastModified: new Date().toISOString(),
        dimensions: 'Calculating...',
        vertices: 'Calculating...',
        faces: 'Calculating...'
      };
      
      setModelInfo(info);
      onModelInfo?.(info);
      console.log('Model info extracted:', info);
      
    } catch (error) {
      console.error('Error extracting model info:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    if (fileUrl && fileName) {
      extractModelInfo();
    }
  }, [fileUrl, fileName]);

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

        {/* Model Info Display */}
        {modelInfo && (
          <div className="absolute bottom-4 right-4 z-10 bg-background/90 rounded-md p-3 text-xs">
            <div className="space-y-1">
              <div><strong>File:</strong> {modelInfo.fileName}</div>
              <div><strong>Size:</strong> {modelInfo.fileSizeFormatted}</div>
              <div><strong>Type:</strong> {modelInfo.fileType.toUpperCase()}</div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-20">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading 3D model...</p>
              <p className="text-xs text-muted-foreground mt-1">Analyzing geometry...</p>
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
