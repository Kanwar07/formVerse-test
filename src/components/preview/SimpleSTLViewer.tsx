import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import * as THREE from 'three';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Move3D, ZoomIn, RotateCcw, Loader2 } from 'lucide-react';
import { LoadingIndicator3D } from './LoadingIndicator3D';

interface SimpleSTLViewerProps {
  fileUrl: string;
  className?: string;
  background?: 'white' | 'grey' | 'black' | 'gradient';
  onBackgroundChange?: (bg: 'white' | 'grey' | 'black' | 'gradient') => void;
}

// Enhanced camera controller with better auto-fitting and zoom
const CameraController = ({ 
  geometry, 
  onCameraSetup 
}: { 
  geometry: THREE.BufferGeometry | null;
  onCameraSetup?: (resetFunction: () => void) => void;
}) => {
  const { camera, controls } = useThree();
  const [modelBounds, setModelBounds] = useState<{
    center: THREE.Vector3;
    size: number;
  } | null>(null);
  
  const setupCamera = () => {
    if (!geometry || !controls) return;
    
    // Calculate bounding box safely
    const positionAttribute = geometry.attributes.position;
    if (!positionAttribute) return;
    
    const box = new THREE.Box3().setFromBufferAttribute(positionAttribute as THREE.BufferAttribute);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3()).length();
    
    // Set camera far to be very large for better zoom out
    const cam = camera as THREE.PerspectiveCamera;
    cam.near = size * 0.001; // Very close
    cam.far = size * 100; // Very far for extensive zoom out
    
    // Position camera to view the entire model
    const distance = size * 2;
    cam.position.set(center.x, center.y, center.z + distance);
    cam.lookAt(center);
    cam.updateProjectionMatrix();
    
    // Set up orbit controls target and limits
    if (controls && 'target' in controls) {
      (controls as any).target.copy(center);
      (controls as any).minDistance = size * 0.1; // Allow very close zoom
      (controls as any).maxDistance = size * 10; // Allow extensive zoom out
      (controls as any).update();
    }
    
    setModelBounds({ center, size });
    console.log('Camera setup complete:', { 
      center, 
      size, 
      distance, 
      near: cam.near, 
      far: cam.far,
      minDistance: size * 0.1,
      maxDistance: size * 10
    });
  };
  
  const resetView = () => {
    if (!modelBounds || !controls) return;
    
    const { center, size } = modelBounds;
    const distance = size * 2;
    
    // Smooth animated reset
    const startPosition = camera.position.clone();
    const targetPosition = new THREE.Vector3(center.x, center.y, center.z + distance);
    const startTime = Date.now();
    const duration = 800; // 800ms animation
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate camera position
      camera.position.lerpVectors(startPosition, targetPosition, easeOut);
      camera.lookAt(center);
      camera.updateProjectionMatrix();
      
      // Update controls target
      if (controls && 'target' in controls) {
        (controls as any).target.copy(center);
        (controls as any).update();
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  };
  
  useEffect(() => {
    setupCamera();
    if (onCameraSetup) {
      onCameraSetup(resetView);
    }
  }, [geometry, camera, controls]);
  
  return null;
};

const STLModel = ({ fileUrl, onCameraSetup }: { fileUrl: string; onCameraSetup?: (resetFunction: () => void) => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileUrl) {
      setError('No file URL provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);
    
    const loader = new STLLoader();
    
    // Use XMLHttpRequest for better cross-origin support
    const loadModel = async () => {
      try {
        console.log('Starting STL loading for:', fileUrl);
        setProgress(10);
        
        // Use XMLHttpRequest for better CORS handling
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'arraybuffer';
        
        const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
          xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
              console.log('File loaded successfully, size:', xhr.response.byteLength, 'bytes');
              setProgress(50);
              resolve(xhr.response);
            } else {
              reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
          });
          
          xhr.addEventListener('error', () => {
            reject(new Error('Network error occurred'));
          });
          
          xhr.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progressPercent = Math.round((event.loaded / event.total) * 40) + 10; // 10-50%
              setProgress(progressPercent);
            }
          });
          
          xhr.open('GET', fileUrl);
          xhr.send();
        });
        
        console.log('Parsing STL geometry...');
        setProgress(70);
        const loadedGeometry = loader.parse(arrayBuffer);
        setProgress(90);
        
        console.log('Processing geometry...');
        // Create a clean copy of the geometry to avoid prop conflicts
        const bufferGeometry = loadedGeometry.clone();
        bufferGeometry.computeBoundingBox();
        bufferGeometry.computeBoundingSphere();
        if (!bufferGeometry.attributes.normal) {
          bufferGeometry.computeVertexNormals();
        }
        
        console.log('Geometry processed successfully:', {
          vertices: bufferGeometry.attributes.position?.count || 0,
          boundingBox: bufferGeometry.boundingBox,
          boundingSphere: bufferGeometry.boundingSphere
        });
        
        setGeometry(bufferGeometry);
        setProgress(100);
        setLoading(false);
        setError(null);
        console.log('STL model loaded successfully');
      } catch (err) {
        console.error('STL loading error:', err);
        setError(`Failed to load 3D model: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setLoading(false);
        setProgress(0);
      }
    };

    loadModel();
  }, [fileUrl]);

  if (loading) {
    return <LoadingIndicator3D progress={progress} />;
  }

  if (error || !geometry) {
    return (
      <>
        <CameraController geometry={null} />
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0, 3, 0]}>
          <planeGeometry args={[4, 1]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
      </>
    );
  }

  return (
    <>
      <CameraController geometry={geometry} onCameraSetup={onCameraSetup} />
      <Center>
        <mesh ref={meshRef} geometry={geometry}>
          <meshStandardMaterial 
            color="#666666" 
            metalness={0.1} 
            roughness={0.3} 
          />
        </mesh>
      </Center>
    </>
  );
};

interface ViewerToolbarProps {
  background: 'white' | 'grey' | 'black' | 'gradient';
  onBackgroundChange: (bg: 'white' | 'grey' | 'black' | 'gradient') => void;
  onResetView: () => void;
  resetDisabled: boolean;
}

const ViewerToolbar = ({ background, onBackgroundChange, onResetView, resetDisabled }: ViewerToolbarProps) => {
  return (
    <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2">
      {/* Background Controls */}
      <div className="flex items-center gap-2 bg-background/95 backdrop-blur-sm border rounded-lg px-3 py-2 shadow-lg">
        <span className="text-xs font-medium text-muted-foreground hidden sm:block">Background</span>
        <div className="flex gap-1">
          {[
            { value: 'white', label: 'W', color: 'bg-white border-2 border-border' },
            { value: 'grey', label: 'G', color: 'bg-muted' },
            { value: 'black', label: 'B', color: 'bg-black' },
            { value: 'gradient', label: '∇', color: 'bg-gradient-to-br from-muted to-background' }
          ].map(({ value, label, color }) => (
            <button
              key={value}
              onClick={() => onBackgroundChange(value as any)}
              className={`w-8 h-8 rounded text-xs font-bold transition-all duration-200 ${color} ${
                background === value 
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' 
                  : 'hover:scale-105 border border-border/50'
              } ${value === 'white' ? 'text-black' : 'text-white'}`}
              title={`${value.charAt(0).toUpperCase() + value.slice(1)} Background`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onResetView}
        disabled={resetDisabled}
        className="bg-black/90 text-white border-black hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-200 shadow-lg"
      >
        <RotateCcw className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Reset View</span>
      </Button>
    </div>
  );
};

export const SimpleSTLViewer = ({ fileUrl, className = "", background = 'gradient', onBackgroundChange }: SimpleSTLViewerProps) => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [resetView, setResetView] = useState<(() => void) | null>(null);

  // Hide instructions after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleCameraSetup = (resetFunction: () => void) => {
    setResetView(() => resetFunction);
  };

  const handleResetView = () => {
    if (resetView) {
      resetView();
    }
  };

  // Force true white for white background instead of theme white
  const canvasBg = background === 'white'
    ? '#ffffff'
    : background === 'grey'
    ? 'hsl(var(--muted))'
    : background === 'black'
    ? '#000000'
    : 'linear-gradient(180deg, hsl(var(--muted)), hsl(var(--background)))';

  return (
    <div className={`relative w-full h-[400px] md:h-[500px] ${className}`}>
      <Canvas
        camera={{ 
          position: [5, 5, 5], 
          fov: 50,
          near: 0.01,
          far: 2000
        }}
        style={{ background: canvasBg }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={<LoadingIndicator3D />}>
          <STLModel fileUrl={fileUrl} onCameraSetup={handleCameraSetup} />
        </Suspense>
        <OrbitControls 
          makeDefault
          enablePan 
          enableZoom 
          enableRotate
          minDistance={0.1}
          maxDistance={1000}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
      
      {/* Toolbar - Background controls + Reset button */}
      {onBackgroundChange && (
        <ViewerToolbar
          background={background}
          onBackgroundChange={onBackgroundChange}
          onResetView={handleResetView}
          resetDisabled={!resetView}
        />
      )}
      
      {/* User Instructions Overlay - Only show initially */}
      {showInstructions && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 animate-fade-in">
          <Badge variant="secondary" className="flex items-center gap-2 px-3 py-2 shadow-lg bg-background/95 backdrop-blur-sm">
            <Move3D className="h-4 w-4" />
            <span className="text-sm hidden sm:inline">Drag to rotate</span>
            <span className="text-xs sm:hidden">Drag • Pinch</span>
            <ZoomIn className="h-4 w-4 ml-2" />
            <span className="text-sm hidden sm:inline">Scroll to zoom</span>
          </Badge>
        </div>
      )}
      
      {/* Persistent Control Hint - Bottom right */}
      <div className="absolute bottom-3 right-3 z-10">
        <Badge variant="outline" className="text-xs bg-background/95 backdrop-blur-sm shadow-sm">
          Interactive 3D
        </Badge>
      </div>
    </div>
  );
};