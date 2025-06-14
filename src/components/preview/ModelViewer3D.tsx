
import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Center } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, RotateCcw, ZoomIn, ZoomOut, Info } from 'lucide-react';

interface Model3DProps {
  fileUrl: string;
  fileType: string;
  onGeometryLoaded?: (geometry: THREE.BufferGeometry) => void;
}

const Model3D = ({ fileUrl, fileType, onGeometryLoaded }: Model3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const { scene } = useThree();
  
  let geometry: THREE.BufferGeometry;
  
  try {
    console.log('Loading 3D model:', fileUrl, fileType);
    
    if (fileType.toLowerCase().includes('stl') || fileUrl.toLowerCase().includes('.stl')) {
      console.log('Loading STL file...');
      geometry = useLoader(STLLoader, fileUrl);
    } else if (fileType.toLowerCase().includes('obj') || fileUrl.toLowerCase().includes('.obj')) {
      console.log('Loading OBJ file...');
      const obj = useLoader(OBJLoader, fileUrl);
      const mesh = obj.children.find(child => child instanceof THREE.Mesh) as THREE.Mesh;
      geometry = mesh?.geometry || new THREE.BoxGeometry(2, 2, 2);
    } else {
      console.log('Using fallback geometry');
      geometry = new THREE.BoxGeometry(2, 2, 2);
    }
    
    console.log('Geometry loaded successfully:', geometry);
    
  } catch (error) {
    console.error('Error loading 3D model:', error);
    geometry = new THREE.BoxGeometry(2, 2, 2);
  }

  useEffect(() => {
    if (geometry && !modelLoaded) {
      console.log('Processing loaded geometry...');
      
      // Compute bounding box and center the geometry
      geometry.computeBoundingBox();
      geometry.computeVertexNormals();
      
      if (geometry.boundingBox) {
        const center = new THREE.Vector3();
        geometry.boundingBox.getCenter(center);
        geometry.translate(-center.x, -center.y, -center.z);
        
        // Scale the model to fit in view
        const size = new THREE.Vector3();
        geometry.boundingBox.getSize(size);
        const maxDimension = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDimension; // Scale to fit in 3 unit cube
        geometry.scale(scale, scale, scale);
        
        console.log('Model centered and scaled. Original size:', size, 'Scale factor:', scale);
      }
      
      setModelLoaded(true);
      onGeometryLoaded?.(geometry);
    }
  }, [geometry, modelLoaded, onGeometryLoaded]);

  // Auto-rotate the model for better visualization
  useFrame(() => {
    if (meshRef.current && modelLoaded) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  // Add wireframe for better STL visualization
  const materials = [
    new THREE.MeshStandardMaterial({ 
      color: '#888888', 
      metalness: 0.1,
      roughness: 0.4
    }),
    new THREE.MeshBasicMaterial({ 
      color: '#333333', 
      wireframe: true,
      transparent: true,
      opacity: 0.1
    })
  ];

  return (
    <Center>
      <group>
        {/* Solid mesh */}
        <mesh ref={meshRef} geometry={geometry} material={materials[0]} />
        {/* Wireframe overlay for STL files */}
        {(fileType.toLowerCase().includes('stl') || fileUrl.toLowerCase().includes('.stl')) && (
          <mesh geometry={geometry} material={materials[1]} />
        )}
      </group>
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
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleGeometryLoaded = (geometry: THREE.BufferGeometry) => {
    console.log('Geometry loaded in viewer:', geometry);
    
    // Extract detailed model information
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
      volume: (size.x * size.y * size.z).toFixed(2) + ' cubic units',
      surfaceArea: 'Calculating...',
      isValid: vertices > 0 && faces > 0
    };
    
    setModelInfo(info);
    onModelInfo?.(info);
    setIsLoading(false);
    console.log('Model analysis complete:', info);
  };

  const handleModelError = (error: any) => {
    setError('Failed to load 3D model. The file may be corrupted or in an unsupported format.');
    setIsLoading(false);
    console.error('3D Model loading error:', error);
  };

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full h-[500px]">
      <CardContent className="p-0 h-full relative">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Back to Preview
          </Button>
        </div>
        
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button variant="outline" size="sm" title="Reset View">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Model Info Display */}
        {modelInfo && (
          <div className="absolute bottom-4 right-4 z-10 bg-background/95 backdrop-blur rounded-md p-3 text-xs max-w-xs">
            <div className="flex items-center mb-2">
              <Info className="h-4 w-4 mr-2" />
              <span className="font-medium">Model Details</span>
            </div>
            <div className="space-y-1">
              <div><strong>Format:</strong> {modelInfo.fileType}</div>
              <div><strong>Vertices:</strong> {modelInfo.vertices}</div>
              <div><strong>Faces:</strong> {modelInfo.faces}</div>
              <div><strong>Dimensions:</strong> {modelInfo.dimensions}</div>
              <div><strong>Status:</strong> 
                <span className={modelInfo.isValid ? 'text-green-600' : 'text-red-600'}>
                  {modelInfo.isValid ? ' Valid' : ' Invalid'}
                </span>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-20">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading 3D model...</p>
              <p className="text-xs text-muted-foreground mt-1">
                Analyzing CAD geometry... {loadingProgress}%
              </p>
              <div className="w-32 h-1 bg-muted rounded-full mt-2 mx-auto">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 z-20">
            <div className="text-center">
              <p className="text-destructive font-medium">Failed to load 3D model</p>
              <p className="text-sm text-muted-foreground mt-1">
                {error}
              </p>
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
          camera={{ position: [5, 5, 5], fov: 50 }}
          onCreated={({ gl }) => {
            gl.setClearColor('#f8f9fa');
          }}
        >
          <Suspense 
            fallback={null}
          >
            <Environment preset="studio" />
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <directionalLight position={[-10, -10, -5]} intensity={0.4} />
            <pointLight position={[0, 10, 0]} intensity={0.3} />
            
            <Model3D 
              fileUrl={fileUrl} 
              fileType={fileType}
              onGeometryLoaded={handleGeometryLoaded}
            />
            
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2}
              maxDistance={15}
              autoRotate={false}
              autoRotateSpeed={0.5}
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
