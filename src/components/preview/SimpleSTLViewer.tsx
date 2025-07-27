import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import * as THREE from 'three';

interface SimpleSTLViewerProps {
  fileUrl: string;
  className?: string;
}

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
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#cccccc" transparent opacity={0.5} />
      </mesh>
    );
  }

  if (error || !geometry) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ff4444" transparent opacity={0.5} />
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

export const SimpleSTLViewer = ({ fileUrl, className = "" }: SimpleSTLViewerProps) => {
  return (
    <div className={`w-full h-[400px] ${className}`}>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        style={{ background: 'linear-gradient(to bottom, #f0f0f0, #ffffff)' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <STLModel fileUrl={fileUrl} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};