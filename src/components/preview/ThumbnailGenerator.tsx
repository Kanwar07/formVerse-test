
import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, Center } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import * as THREE from 'three';

interface ThumbnailModel3DProps {
  fileUrl: string;
  fileType: string;
  onThumbnailReady: (dataUrl: string) => void;
}

const ThumbnailModel3D = ({ fileUrl, fileType, onThumbnailReady }: ThumbnailModel3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [captureReady, setCaptureReady] = useState(false);
  
  let geometry;
  
  try {
    if (fileType.toLowerCase().includes('stl')) {
      geometry = useLoader(STLLoader, fileUrl);
    } else if (fileType.toLowerCase().includes('obj')) {
      const obj = useLoader(OBJLoader, fileUrl);
      const mesh = obj.children.find(child => child instanceof THREE.Mesh) as THREE.Mesh;
      geometry = mesh?.geometry || new THREE.BoxGeometry(2, 2, 2);
    } else {
      geometry = new THREE.BoxGeometry(2, 2, 2);
    }
  } catch (error) {
    console.error('Error loading 3D model for thumbnail:', error);
    geometry = new THREE.BoxGeometry(2, 2, 2);
  }

  useEffect(() => {
    if (geometry && !captureReady) {
      geometry.computeBoundingBox();
      // Wait a moment for the model to be properly positioned
      setTimeout(() => setCaptureReady(true), 1000);
    }
  }, [geometry, captureReady]);

  // Auto-rotate the model slightly for a good angle
  useFrame(() => {
    if (meshRef.current && captureReady) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = Math.PI * 0.1; // Slight tilt
    }
  });

  return (
    <Center>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial 
          color="#888888" 
          metalness={0.1}
          roughness={0.4}
        />
      </mesh>
    </Center>
  );
};

interface ThumbnailGeneratorProps {
  fileUrl: string;
  fileName: string;
  fileType: string;
  onThumbnailGenerated: (thumbnailUrl: string) => void;
  onError?: (error: string) => void;
}

export const ThumbnailGenerator = ({ 
  fileUrl, 
  fileName, 
  fileType, 
  onThumbnailGenerated,
  onError 
}: ThumbnailGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  const captureThumbnail = () => {
    if (!canvasRef.current) return;
    
    try {
      // Wait a moment for the scene to render
      setTimeout(() => {
        if (canvasRef.current) {
          const dataUrl = canvasRef.current.toDataURL('image/png');
          onThumbnailGenerated(dataUrl);
          setIsGenerating(false);
          console.log('Thumbnail generated successfully for:', fileName);
        }
      }, 2000);
    } catch (error) {
      console.error('Error capturing thumbnail:', error);
      onError?.('Failed to generate thumbnail');
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (fileUrl && fileName) {
      console.log('Starting thumbnail generation for:', fileName);
      captureThumbnail();
    }
  }, [fileUrl, fileName]);

  return (
    <div style={{ 
      position: 'absolute', 
      top: '-9999px', 
      left: '-9999px',
      width: '512px',
      height: '512px'
    }}>
      <Canvas
        ref={canvasRef}
        camera={{ position: [3, 2, 5], fov: 50 }}
        style={{ width: '512px', height: '512px' }}
      >
        <Environment preset="studio" />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <directionalLight position={[-10, -10, -5]} intensity={0.4} />
        
        <ThumbnailModel3D 
          fileUrl={fileUrl} 
          fileType={fileType}
          onThumbnailReady={captureThumbnail}
        />
        
        <OrbitControls
          enabled={false}
          autoRotate={false}
        />
      </Canvas>
      
      {isGenerating && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px'
        }}>
          Generating thumbnail...
        </div>
      )}
    </div>
  );
};
