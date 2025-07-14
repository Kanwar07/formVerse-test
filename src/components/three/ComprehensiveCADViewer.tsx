import React, { useRef, useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Center, 
  Html, 
  useProgress,
  Edges,
  Grid,
  GizmoHelper,
  GizmoViewport
} from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import { GLTFLoader } from 'three-stdlib';
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
  Maximize,
  Download,
  Settings
} from 'lucide-react';

interface CADAnalysisResult {
  vertices: number;
  faces: number;
  boundingBox: THREE.Box3;
  volume: number;
  surfaceArea: number;
  issues: {
    type: 'non-manifold' | 'inverted-normals' | 'degenerate-faces' | 'holes';
    severity: 'low' | 'medium' | 'high';
    count: number;
    description: string;
  }[];
  materials: string[];
  scale: THREE.Vector3;
  center: THREE.Vector3;
}

interface CADModelProps {
  fileUrl: string;
  fileType: string;
  onAnalysisComplete?: (analysis: CADAnalysisResult) => void;
  onLoadError?: (error: string) => void;
  wireframeMode?: boolean;
  showIssues?: boolean;
}

// Enhanced loader component with progress
function LoadingIndicator() {
  const { active, progress, errors, item, loaded, total } = useProgress();
  
  return (
    <Html center>
      <div className="bg-background/95 backdrop-blur rounded-lg p-6 border shadow-lg min-w-[200px]">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <div className="text-center space-y-2">
          <p className="font-medium">Loading CAD Model</p>
          <p className="text-sm text-muted-foreground">
            {progress.toFixed(0)}% complete
          </p>
          <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          {item && (
            <p className="text-xs text-muted-foreground">
              Loading: {item}
            </p>
          )}
        </div>
      </div>
    </Html>
  );
}

// CAD Model component with analysis
const CADModel = ({ 
  fileUrl, 
  fileType, 
  onAnalysisComplete, 
  onLoadError,
  wireframeMode = false,
  showIssues = false 
}: CADModelProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [materials, setMaterials] = useState<THREE.Material[]>([]);
  const [analysis, setAnalysis] = useState<CADAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Analyze geometry for issues and properties
  const analyzeGeometry = useCallback((geom: THREE.BufferGeometry): CADAnalysisResult => {
    const vertices = geom.attributes.position ? geom.attributes.position.count : 0;
    const faces = geom.index ? geom.index.count / 3 : vertices / 3;
    
    geom.computeBoundingBox();
    geom.computeBoundingSphere();
    
    const boundingBox = geom.boundingBox!;
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    boundingBox.getSize(size);
    boundingBox.getCenter(center);

    // Basic volume calculation (approximation)
    const volume = size.x * size.y * size.z;
    
    // Surface area approximation
    let surfaceArea = 0;
    if (geom.index) {
      const positions = geom.attributes.position.array;
      const indices = geom.index.array;
      
      for (let i = 0; i < indices.length; i += 3) {
        const a = new THREE.Vector3().fromArray(positions, indices[i] * 3);
        const b = new THREE.Vector3().fromArray(positions, indices[i + 1] * 3);
        const c = new THREE.Vector3().fromArray(positions, indices[i + 2] * 3);
        
        const ab = b.clone().sub(a);
        const ac = c.clone().sub(a);
        const cross = ab.cross(ac);
        surfaceArea += cross.length() * 0.5;
      }
    }

    // Issue detection (simplified)
    const issues: CADAnalysisResult['issues'] = [];
    
    // Check for degenerate faces
    if (faces < vertices / 10) {
      issues.push({
        type: 'degenerate-faces',
        severity: 'medium',
        count: Math.floor(vertices / 10 - faces),
        description: 'Some faces may be degenerate or have zero area'
      });
    }

    // Check normals
    if (!geom.attributes.normal) {
      issues.push({
        type: 'inverted-normals',
        severity: 'low',
        count: 1,
        description: 'Normals need to be computed'
      });
    }

    return {
      vertices,
      faces: Math.floor(faces),
      boundingBox,
      volume,
      surfaceArea,
      issues,
      materials: ['Default Material'],
      scale: size,
      center
    };
  }, []);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        
        // Detect file type
        const extension = fileType.toLowerCase() || fileUrl.split('.').pop()?.toLowerCase();
        let loadedGeometry: THREE.BufferGeometry;
        let loadedMaterials: THREE.Material[] = [];

        switch (extension) {
          case 'stl':
            const stlLoader = new STLLoader();
            loadedGeometry = await new Promise<THREE.BufferGeometry>((resolve, reject) => {
              stlLoader.load(fileUrl, resolve, undefined, reject);
            });
            break;

          case 'obj':
            const objLoader = new OBJLoader();
            const objGroup = await new Promise<THREE.Group>((resolve, reject) => {
              objLoader.load(fileUrl, resolve, undefined, reject);
            });
            const objMesh = objGroup.children.find(child => child instanceof THREE.Mesh) as THREE.Mesh;
            if (!objMesh?.geometry) throw new Error('No geometry found in OBJ');
            loadedGeometry = objMesh.geometry;
            if (objMesh.material) {
              loadedMaterials = Array.isArray(objMesh.material) ? objMesh.material : [objMesh.material];
            }
            break;

          case 'gltf':
          case 'glb':
            const gltfLoader = new GLTFLoader();
            const gltf = await new Promise<any>((resolve, reject) => {
              gltfLoader.load(fileUrl, resolve, undefined, reject);
            });
            
            // Extract geometry from GLTF scene
            const meshes: THREE.Mesh[] = [];
            gltf.scene.traverse((child: any) => {
              if (child instanceof THREE.Mesh) {
                meshes.push(child);
              }
            });
            
            if (meshes.length === 0) throw new Error('No meshes found in GLTF');
            
            // For now, use the first mesh
            loadedGeometry = meshes[0].geometry;
            if (meshes[0].material) {
              loadedMaterials = Array.isArray(meshes[0].material) ? meshes[0].material : [meshes[0].material];
            }
            break;

          default:
            throw new Error(`Unsupported file format: ${extension}`);
        }

        // Process geometry
        loadedGeometry.computeBoundingBox();
        loadedGeometry.computeVertexNormals();
        loadedGeometry.computeBoundingSphere();

        // Center and scale geometry
        const box = loadedGeometry.boundingBox!;
        const center = new THREE.Vector3();
        box.getCenter(center);
        loadedGeometry.translate(-center.x, -center.y, -center.z);

        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDimension = Math.max(size.x, size.y, size.z);
        if (maxDimension > 0) {
          const scale = 4 / maxDimension; // Scale to fit in 4 unit cube
          loadedGeometry.scale(scale, scale, scale);
        }

        // Analyze the geometry
        const analysisResult = analyzeGeometry(loadedGeometry);
        setAnalysis(analysisResult);
        onAnalysisComplete?.(analysisResult);

        setGeometry(loadedGeometry);
        setMaterials(loadedMaterials);
        setLoading(false);

      } catch (error) {
        console.error('CAD Model loading error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        onLoadError?.(errorMessage);
        setLoading(false);
      }
    };

    if (fileUrl) {
      loadModel();
    }
  }, [fileUrl, fileType, analyzeGeometry, onAnalysisComplete, onLoadError]);

  // Render loading state
  if (loading || !geometry) {
    return (
      <mesh>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color="#888888" transparent opacity={0.3} />
      </mesh>
    );
  }

  // Create material based on mode
  const material = wireframeMode
    ? new THREE.MeshBasicMaterial({ 
        color: '#00d4ff', 
        wireframe: true,
        transparent: true,
        opacity: 0.8
      })
    : materials.length > 0 
      ? materials[0]
      : new THREE.MeshStandardMaterial({ 
          color: '#666666',
          metalness: 0.1,
          roughness: 0.3
        });

  return (
    <Center>
      <group ref={groupRef}>
        <mesh ref={meshRef} geometry={geometry} material={material}>
          {showIssues && analysis?.issues.length > 0 && (
            <Edges threshold={15} color="#ff4444" />
          )}
        </mesh>
        
        {/* Issue visualization */}
        {showIssues && analysis?.issues.map((issue, index) => (
          <Html
            key={index}
            position={[2, 2 - index * 0.5, 0]}
            distanceFactor={10}
            occlude={false}
          >
            <div className="bg-destructive/90 text-destructive-foreground px-2 py-1 rounded text-xs">
              {issue.type}: {issue.count}
            </div>
          </Html>
        ))}
      </group>
    </Center>
  );
};

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
          <Suspense fallback={<LoadingIndicator />}>
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
            <CADModel 
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