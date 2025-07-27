import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import * as THREE from 'three';
import { Badge } from '@/components/ui/badge';
import { Move3D, ZoomIn } from 'lucide-react';

interface SimpleSTLViewerProps {
  fileUrl: string;
  className?: string;
}

// Camera auto-fit component
const CameraController = ({ geometry }: { geometry: THREE.BufferGeometry | null }) => {
  const { camera, scene } = useThree();
  
  useEffect(() => {
    if (!geometry) return;
    
    // Calculate bounding box safely
    const positionAttribute = geometry.attributes.position;
    if (!positionAttribute) return;
    
    const box = new THREE.Box3().setFromBufferAttribute(positionAttribute as THREE.BufferAttribute);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // Calculate the distance needed to fit the model
    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim / (2 * Math.tan((camera as THREE.PerspectiveCamera).fov * Math.PI / 360));
    
    // Position camera to view the entire model
    camera.position.set(distance * 1.5, distance * 1.5, distance * 1.5);
    camera.lookAt(center);
    camera.updateProjectionMatrix();
  }, [geometry, camera, scene]);
  
  return null;
};

const STLModel = ({ fileUrl }: { fileUrl: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loader = new STLLoader();
    
    loader.load(
      fileUrl,
      (loadedGeometry) => {
        try {
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
        } catch (err) {
          console.error('Error processing STL geometry:', err);
          setError('Failed to process 3D model');
          setLoading(false);
        }
      },
      (progress) => {
        console.log('STL loading progress:', progress);
      },
      (err) => {
        console.error('STL loading error:', err);
        setError('Failed to load 3D model');
        setLoading(false);
      }
    );
  }, [fileUrl]);

  if (loading) {
    return (
      <>
        <CameraController geometry={null} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#cccccc" transparent opacity={0.5} />
        </mesh>
      </>
    );
  }

  if (error || !geometry) {
    return (
      <>
        <CameraController geometry={null} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#ff4444" transparent opacity={0.5} />
        </mesh>
      </>
    );
  }

  return (
    <>
      <CameraController geometry={geometry} />
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

  // Hide instructions after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative w-full h-[400px] ${className}`}>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        style={{ background: 'linear-gradient(to bottom, #f0f0f0, #ffffff)' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <STLModel fileUrl={fileUrl} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
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
      
      {/* Persistent Control Hint */}
      <div className="absolute bottom-4 right-4 z-10">
        <Badge variant="outline" className="text-xs opacity-75">
          Interactive 3D Model
        </Badge>
      </div>
    </div>
  );
};