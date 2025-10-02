import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useProgress, Html } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import * as THREE from 'three';

interface AdvancedModelViewerProps {
  modelUrl: string;
  fileType: string;
  onAnalytics?: (event: string, data?: any) => void;
}


function Loader() {
  const { active, progress, errors, item, loaded, total } = useProgress();
  return (
    <Html center>
      <div className="text-white text-center">
        <div className="mb-2">{progress.toFixed(0)}% loaded</div>
        <div className="w-32 h-2 bg-gray-700 rounded">
          <div 
            className="h-2 bg-blue-500 rounded transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Html>
  );
}

// Model component
function Model({ url, fileType, onLoad }: { url: string; fileType: string; onLoad?: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    let loader: STLLoader | OBJLoader;
    
    if (fileType === 'stl') {
      loader = new STLLoader();
      loader.load(
        url,
        (geometry) => {
          geometry.computeVertexNormals();
          geometry.center();
          setGeometry(geometry);
          onLoad?.();
        },
        undefined,
        (error) => console.error('Error loading STL:', error)
      );
    } else if (fileType === 'obj') {
      loader = new OBJLoader();
      loader.load(
        url,
        (object) => {
          const mesh = object.children[0] as THREE.Mesh;
          if (mesh && mesh.geometry) {
            mesh.geometry.computeVertexNormals();
            mesh.geometry.center();
            setGeometry(mesh.geometry);
            onLoad?.();
          }
        },
        undefined,
        (error) => console.error('Error loading OBJ:', error)
      );
    }
  }, [url, fileType, onLoad]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  if (!geometry) return null;

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial 
        color="#6366f1" 
        metalness={0.7}
        roughness={0.2}
      />
    </mesh>
  );
}

export function AdvancedModelViewer({ modelUrl, fileType, onAnalytics }: AdvancedModelViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewTime, setViewTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (viewTime > 0 && viewTime % 10 === 0) {
      onAnalytics?.('model_view_time', { seconds: viewTime });
    }
  }, [viewTime, onAnalytics]);

  const handleModelLoad = () => {
    setIsLoaded(true);
    onAnalytics?.('model_loaded', { fileType, loadTime: Date.now() });
  };

  return (
    <div className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={<Loader />}>
          <Environment preset="studio" />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Model 
            url={modelUrl} 
            fileType={fileType} 
            onLoad={handleModelLoad}
          />
          <ContactShadows 
            position={[0, -1.4, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={1.5} 
          />
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>
      
      {/* Viewer controls */}
      <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded text-sm">
        View Time: {Math.floor(viewTime / 60)}:{(viewTime % 60).toString().padStart(2, '0')}
      </div>
    </div>
  );
}
