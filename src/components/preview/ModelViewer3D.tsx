
import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Center } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, RotateCcw, Info, AlertCircle } from 'lucide-react';

interface Model3DProps {
  fileUrl: string;
  fileType: string;
  onGeometryLoaded?: (geometry: THREE.BufferGeometry) => void;
  onLoadError?: (error: string) => void;
}

const Model3D = ({ fileUrl, fileType, onGeometryLoaded, onLoadError }: Model3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  console.log('Model3D: Starting to load', fileUrl, fileType);
  
  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Verify file accessibility first
        const response = await fetch(fileUrl, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`File not accessible: ${response.status}`);
        }
        
        console.log('Model3D: File is accessible, loading geometry...');
        
        let loadedGeometry: THREE.BufferGeometry;
        
        if (fileType.toLowerCase().includes('stl') || fileUrl.toLowerCase().includes('.stl')) {
          console.log('Model3D: Loading STL file');
          const loader = new STLLoader();
          loadedGeometry = await new Promise<THREE.BufferGeometry>((resolve, reject) => {
            loader.load(
              fileUrl,
              (geometry) => {
                console.log('Model3D: STL loaded successfully', geometry);
                resolve(geometry);
              },
              (progress) => {
                console.log('Model3D: Loading progress', progress);
              },
              (error) => {
                console.error('Model3D: STL loading error', error);
                reject(error);
              }
            );
          });
        } else if (fileType.toLowerCase().includes('obj') || fileUrl.toLowerCase().includes('.obj')) {
          console.log('Model3D: Loading OBJ file');
          const loader = new OBJLoader();
          const obj = await new Promise<THREE.Group>((resolve, reject) => {
            loader.load(
              fileUrl,
              (object) => {
                console.log('Model3D: OBJ loaded successfully', object);
                resolve(object);
              },
              (progress) => {
                console.log('Model3D: Loading progress', progress);
              },
              (error) => {
                console.error('Model3D: OBJ loading error', error);
                reject(error);
              }
            );
          });
          
          const mesh = obj.children.find(child => child instanceof THREE.Mesh) as THREE.Mesh;
          if (!mesh || !mesh.geometry) {
            throw new Error('No valid geometry found in OBJ file');
          }
          loadedGeometry = mesh.geometry;
        } else {
          throw new Error(`Unsupported file format: ${fileType}`);
        }
        
        // Process the geometry
        loadedGeometry.computeBoundingBox();
        loadedGeometry.computeVertexNormals();
        
        if (loadedGeometry.boundingBox) {
          const center = new THREE.Vector3();
          loadedGeometry.boundingBox.getCenter(center);
          loadedGeometry.translate(-center.x, -center.y, -center.z);
          
          const size = new THREE.Vector3();
          loadedGeometry.boundingBox.getSize(size);
          const maxDimension = Math.max(size.x, size.y, size.z);
          
          if (maxDimension > 0) {
            const scale = 2 / maxDimension;
            loadedGeometry.scale(scale, scale, scale);
          }
          
          console.log('Model3D: Geometry processed successfully', {
            vertices: loadedGeometry.attributes.position?.count,
            size: size,
            maxDimension
          });
        }
        
        setGeometry(loadedGeometry);
        onGeometryLoaded?.(loadedGeometry);
        setLoading(false);
        
      } catch (error) {
        console.error('Model3D: Failed to load model', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
        onLoadError?.(errorMessage);
        setLoading(false);
      }
    };
    
    if (fileUrl) {
      loadModel();
    }
  }, [fileUrl, fileType, onGeometryLoaded, onLoadError]);

  if (loading) {
    return (
      <mesh>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color="#888888" transparent opacity={0.3} />
      </mesh>
    );
  }

  if (error || !geometry) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff4444" />
      </mesh>
    );
  }

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
    console.log('ModelViewer3D: Geometry loaded successfully');
    
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
          <Suspense fallback={null}>
            <Environment preset="studio" />
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <directionalLight position={[-10, -10, -5]} intensity={0.4} />
            
            <Model3D 
              fileUrl={fileUrl} 
              fileType={fileType}
              onGeometryLoaded={handleGeometryLoaded}
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
