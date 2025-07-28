import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Center } from '@react-three/drei';
import { CADModelLoader, LoadedCADModel } from './CADModelLoader';
import * as THREE from 'three';

interface Model3DProps {
  fileUrl: string;
  fileType: string;
  onScreenshotReady: (dataUrl: string) => void;
}

const Model3D = ({ fileUrl, fileType, onScreenshotReady }: Model3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [modelData, setModelData] = useState<LoadedCADModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [captureTime, setCaptureTime] = useState(0);

  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log('ScreenshotCapture: Loading model for screenshot...', { fileUrl, fileType });
        const data = await CADModelLoader.loadModel(fileUrl, fileType);
        setModelData(data);
        setLoading(false);
        console.log('ScreenshotCapture: Model loaded successfully');
      } catch (error) {
        console.error('ScreenshotCapture: Error loading model:', error);
        setLoading(false);
      }
    };

    if (fileUrl && fileType) {
      loadModel();
    }
  }, [fileUrl, fileType]);

  // Auto-capture screenshot after model loads and rotates to good angle
  useFrame((state) => {
    if (meshRef.current && !loading && modelData) {
      // Rotate the model for a good viewing angle
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = Math.PI * 0.1;
      
      setCaptureTime(prev => prev + 1);
      
      // Capture after 100 frames (about 1.6 seconds at 60fps)
      if (captureTime === 100) {
        // Position camera for optimal screenshot
        state.camera.position.set(3, 2, 5);
        state.camera.lookAt(0, 0, 0);
        
        // Trigger screenshot capture
        setTimeout(() => {
          const canvas = state.gl.domElement;
          const dataUrl = canvas.toDataURL('image/png', 0.9);
          onScreenshotReady(dataUrl);
        }, 100);
      }
    }
  });

  if (loading || !modelData) {
    return (
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
    );
  }

  const material = modelData.materials.length > 0 
    ? modelData.materials[0] 
    : new THREE.MeshStandardMaterial({ 
        color: '#6B7280',
        metalness: 0.2,
        roughness: 0.4 
      });

  return (
    <Center>
      <mesh ref={meshRef} geometry={modelData.geometry} material={material} />
    </Center>
  );
};

interface ScreenshotCaptureProps {
  fileUrl: string;
  fileName: string;
  fileType: string;
  onScreenshotGenerated: (dataUrl: string) => void;
  onError?: (error: string) => void;
}

export const ScreenshotCapture = ({ 
  fileUrl, 
  fileName, 
  fileType, 
  onScreenshotGenerated,
  onError 
}: ScreenshotCaptureProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleScreenshotReady = (dataUrl: string) => {
    console.log('Screenshot captured successfully for:', fileName);
    onScreenshotGenerated(dataUrl);
  };

  return (
    <div style={{ 
      position: 'absolute', 
      top: '-9999px', 
      left: '-9999px',
      width: '800px',
      height: '600px'
    }}>
      <Canvas
        ref={canvasRef}
        camera={{ position: [3, 2, 5], fov: 50 }}
        style={{ width: '800px', height: '600px', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}
      >
        <Environment preset="studio" />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.0} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        <directionalLight position={[0, 10, 0]} intensity={0.5} />
        
        <Model3D 
          fileUrl={fileUrl} 
          fileType={fileType}
          onScreenshotReady={handleScreenshotReady}
        />
        
        <OrbitControls
          enabled={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
};