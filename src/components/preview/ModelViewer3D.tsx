
import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Center } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, RotateCcw, Info } from 'lucide-react';

interface Model3DProps {
  fileUrl: string;
  fileType: string;
  onGeometryLoaded?: (geometry: THREE.BufferGeometry) => void;
}

const Model3D = ({ fileUrl, fileType, onGeometryLoaded }: Model3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  console.log('Model3D component loading:', fileUrl, fileType);
  
  let geometry: THREE.BufferGeometry;
  
  try {
    if (fileType.toLowerCase().includes('stl') || fileUrl.toLowerCase().includes('.stl')) {
      console.log('Loading STL file from:', fileUrl);
      geometry = useLoader(STLLoader, fileUrl);
    } else if (fileType.toLowerCase().includes('obj') || fileUrl.toLowerCase().includes('.obj')) {
      console.log('Loading OBJ file from:', fileUrl);
      const obj = useLoader(OBJLoader, fileUrl);
      const mesh = obj.children.find(child => child instanceof THREE.Mesh) as THREE.Mesh;
      geometry = mesh?.geometry || new THREE.BoxGeometry(1, 1, 1);
    } else {
      console.log('Unsupported format, using placeholder');
      geometry = new THREE.BoxGeometry(1, 1, 1);
    }
  } catch (error) {
    console.error('Error loading model:', error);
    geometry = new THREE.BoxGeometry(1, 1, 1);
  }

  useEffect(() => {
    if (geometry && !modelLoaded) {
      console.log('Processing geometry...', geometry);
      
      // Center and scale the geometry
      geometry.computeBoundingBox();
      geometry.computeVertexNormals();
      
      if (geometry.boundingBox) {
        const center = new THREE.Vector3();
        geometry.boundingBox.getCenter(center);
        geometry.translate(-center.x, -center.y, -center.z);
        
        const size = new THREE.Vector3();
        geometry.boundingBox.getSize(size);
        const maxDimension = Math.max(size.x, size.y, size.z);
        
        if (maxDimension > 0) {
          const scale = 2 / maxDimension;
          geometry.scale(scale, scale, scale);
        }
        
        console.log('Model processed - size:', size, 'vertices:', geometry.attributes.position?.count);
      }
      
      setModelLoaded(true);
      onGeometryLoaded?.(geometry);
    }
  }, [geometry, modelLoaded, onGeometryLoaded]);

  return (
    <Center>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial 
          color="#666666" 
          metalness={0.1}
          roughness={0.3}
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

  const handleGeometryLoaded = (geometry: THREE.BufferGeometry) => {
    console.log('Geometry loaded successfully:', geometry);
    
    const vertices = geometry.attributes.position ? geometry.attributes.position.count : 0;
    const faces = geometry.index ? geometry.index.count / 3 : vertices / 3;
    
    geometry.computeBoundingBox();
    const boundingBox = geometry.boundingBox;
    const size = boundingBox ? new THREE.Vector3() : new THREE.Vector3();
    if (boundingBox) {
      boundingBox.getSize(size);
    }
    
    const info = {
      fileName,
      fileType: fileType.toUpperCase(),
      vertices: vertices.toLocaleString(),
      faces: Math.floor(faces).toLocaleString(),
      dimensions: `${size.x.toFixed(2)} × ${size.y.toFixed(2)} × ${size.z.toFixed(2)}`,
      isValid: vertices > 0 && faces > 0
    };
    
    setModelInfo(info);
    onModelInfo?.(info);
    setIsLoading(false);
    console.log('Model loaded successfully:', info);
  };

  const handleLoadingError = () => {
    console.error('Failed to load 3D model');
    setError('Failed to load the 3D model. Please check the file format.');
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
            <div className="flex items-center mb-2">
              <Info className="h-4 w-4 mr-2" />
              <span className="font-medium">Model Info</span>
            </div>
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
              <p className="text-sm text-muted-foreground">Loading 3D model...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 z-20">
            <div className="text-center">
              <p className="text-destructive font-medium">Error</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </div>
        )}

        <Canvas
          camera={{ position: [3, 3, 3], fov: 50 }}
          onCreated={({ gl }) => {
            gl.setClearColor('#f8f9fa');
          }}
        >
          <Suspense fallback={null}>
            <Environment preset="studio" />
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <directionalLight position={[-10, -10, -5]} intensity={0.4} />
            
            <Model3D 
              fileUrl={fileUrl} 
              fileType={fileType}
              onGeometryLoaded={handleGeometryLoaded}
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
