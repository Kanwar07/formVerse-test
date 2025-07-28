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
    const distance = size * 1.5;
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
    const distance = size * 1.5;
    
    // Reset camera position
    camera.position.set(center.x, center.y, center.z + distance);
    camera.lookAt(center);
    camera.updateProjectionMatrix();
    
    // Reset controls
    if (controls && 'target' in controls) {
      (controls as any).target.copy(center);
      (controls as any).update();
    }
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileUrl) {
      setError('No file URL provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    const loader = new STLLoader();
    
    // Add CORS headers and better error handling
    const loadModel = async () => {
      try {
        const response = await fetch(fileUrl, { 
          mode: 'cors',
          credentials: 'omit' 
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const loadedGeometry = loader.parse(arrayBuffer);
        
        // Create a clean copy of the geometry to avoid prop conflicts
        const bufferGeometry = loadedGeometry.clone();
        bufferGeometry.computeBoundingBox();
        bufferGeometry.computeBoundingSphere();
        if (!bufferGeometry.attributes.normal) {
          bufferGeometry.computeVertexNormals();
        }
        
        setGeometry(bufferGeometry);
        setLoading(false);
        setError(null);
        console.log('STL model loaded successfully');
      } catch (err) {
        console.error('STL loading error:', err);
        setError(`Failed to load 3D model: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setLoading(false);
      }
    };

    loadModel();
  }, [fileUrl]);

  if (loading) {
    return <LoadingIndicator3D />;
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

export const SimpleSTLViewer = ({ fileUrl, className = "" }: SimpleSTLViewerProps) => {
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

  return (
    <div className={`relative w-full h-[400px] ${className}`}>
      <Canvas
        camera={{ 
          position: [5, 5, 5], 
          fov: 50,
          near: 0.01,
          far: 2000
        }}
        style={{ background: 'linear-gradient(to bottom, #f0f0f0, #ffffff)' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={<LoadingIndicator3D />}>
          <STLModel fileUrl={fileUrl} onCameraSetup={handleCameraSetup} />
        </Suspense>
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          minDistance={0.1}
          maxDistance={1000}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
      
      {/* User Instructions Overlay */}
      {showInstructions && (
        <div className="absolute top-4 left-4 z-10 transition-opacity duration-500">
          <Badge variant="secondary" className="flex items-center gap-2 px-3 py-2 shadow-lg">
            <Move3D className="h-4 w-4" />
            <span className="text-sm">Drag to rotate</span>
            <ZoomIn className="h-4 w-4 ml-2" />
            <span className="text-sm">Scroll to zoom</span>
          </Badge>
        </div>
      )}
      
      {/* Reset View Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetView}
          className="bg-white/90 hover:bg-white shadow-sm"
          disabled={!resetView}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset View
        </Button>
      </div>
      
      {/* Persistent Control Hint - Fixed visibility */}
      <div className="absolute bottom-4 right-4 z-10">
        <Badge variant="outline" className="text-xs bg-white/90 text-gray-800 border-gray-300 shadow-sm">
          Interactive 3D Model
        </Badge>
      </div>
    </div>
  );
};