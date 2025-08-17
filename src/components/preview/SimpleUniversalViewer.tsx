import React, { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Center } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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

interface SimpleUniversalViewerProps {
  fileUrl: string;
  fileName: string;
  onClose?: () => void;
  className?: string;
}

// Simple model component that creates basic geometry
const SimpleModel = ({ 
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
  
  // Create appropriate placeholder geometry based on file type
  const createGeometry = () => {
    switch (fileExtension) {
      case 'stl':
        return <sphereGeometry args={[1, 32, 32]} />;
      case 'obj':
        return <coneGeometry args={[1, 2, 8]} />;
      case 'gltf':
      case 'glb':
        return <octahedronGeometry args={[1, 2]} />;
      case 'ply':
        return <tetrahedronGeometry args={[1, 0]} />;
      case 'step':
      case 'iges':
        return <cylinderGeometry args={[0.8, 1.2, 2, 8]} />;
      default:
        return <boxGeometry args={[1.5, 1.5, 1.5]} />;
    }
  };

  // Create material based on file type
  const createMaterial = () => {
    const colors = {
      stl: '#8888ff',
      obj: '#ff8888',
      gltf: '#88ff88',
      glb: '#88ff88',
      ply: '#ffff88',
      step: '#ff88ff',
      iges: '#88ffff',
      default: '#888888'
    };
    
    const color = colors[fileExtension as keyof typeof colors] || colors.default;
    
    if (wireframe) {
      return (
        <meshBasicMaterial 
          color="#00d4ff" 
          wireframe={true}
          transparent={true}
          opacity={0.8}
        />
      );
    }
    
    return (
      <meshStandardMaterial 
        color={color}
        metalness={0.2}
        roughness={0.4}
      />
    );
  };

  return (
    <Center>
      <mesh ref={meshRef}>
        {createGeometry()}
        {createMaterial()}
      </mesh>
    </Center>
  );
};

export const SimpleUniversalViewer = ({ 
  fileUrl, 
  fileName,
  onClose,
  className
}: SimpleUniversalViewerProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  
  const controlsRef = useRef<any>(null);
  const { toast } = useToast();

  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const fileExtension = fileName.split('.').pop()?.toUpperCase() || 'UNKNOWN';

  return (
    <Card className={`w-full h-[600px] flex flex-col ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg truncate max-w-xs" title={fileName}>
              {fileName}
            </CardTitle>
            <Badge variant="secondary">{fileExtension}</Badge>
            <Badge variant="outline" className="text-xs">
              Preview Mode
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
              <span className="font-medium">Preview Mode</span>
            </div>
            <div className="space-y-1">
              <div><strong>Format:</strong> {fileExtension}</div>
              <div><strong>File:</strong> {fileName}</div>
              <div className="text-xs text-muted-foreground mt-2">
                This is a simplified preview. The actual model geometry will be processed for full rendering.
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 z-20">
            <div className="text-center max-w-md mx-4">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
              <p className="text-destructive font-medium mb-2">Preview Error</p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setError(null)}
              >
                Try Again
              </Button>
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
          <Suspense fallback={null}>
            {/* Environment and lighting */}
            <Environment preset="studio" />
            
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[10, 10, 5]} 
              intensity={0.8}
              castShadow
            />
            <directionalLight position={[-5, 5, 5]} intensity={0.4} />
            
            {/* Simple Model */}
            <SimpleModel 
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
              autoRotate={autoRotate}
              autoRotateSpeed={2}
            />
          </Suspense>
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
            {fileExtension} Preview Mode
          </p>
        </div>
      </CardContent>
    </Card>
  );
};