import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { STLLoader } from 'three-stdlib';
import { Mesh, BufferGeometry, MeshStandardMaterial, Vector3, Box3 } from 'three';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { supabase } from '@/integrations/supabase/client';

interface Model3DThumbnailProps {
  modelId: string;
  filePath: string;
  className?: string;
}

function ModelMesh({ url, onLoaded }: { url: string; onLoaded: () => void }) {
  const meshRef = useRef<Mesh>(null);
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);

  useEffect(() => {
    const loader = new STLLoader();
    loader.load(
      url,
      (loadedGeometry) => {
        // Center and scale the geometry
        const box = new Box3().setFromBufferAttribute(loadedGeometry.attributes.position as any);
        const center = box.getCenter(new Vector3());
        const size = box.getSize(new Vector3());
        
        // Center the geometry
        loadedGeometry.translate(-center.x, -center.y, -center.z);
        
        // Scale to fit in a unit cube
        const maxSize = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxSize;
        loadedGeometry.scale(scale, scale, scale);
        
        // Compute normals for proper lighting
        loadedGeometry.computeVertexNormals();
        
        setGeometry(loadedGeometry);
        onLoaded();
      },
      undefined,
      (error) => {
        console.error('Error loading STL:', error);
        onLoaded();
      }
    );
  }, [url, onLoaded]);

  // Auto-rotation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  if (!geometry) return null;

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial 
        color="#6366f1" 
        metalness={0.1} 
        roughness={0.3}
      />
    </mesh>
  );
}

function Scene({ modelUrl, onLoaded }: { modelUrl: string; onLoaded: () => void }) {
  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.8} 
        castShadow
      />
      <directionalLight 
        position={[-5, -5, -5]} 
        intensity={0.4} 
      />
      
      {/* Camera setup */}
      <PerspectiveCamera 
        makeDefault 
        position={[3, 2, 3]} 
        fov={45}
      />
      
      {/* Model */}
      <ModelMesh url={modelUrl} onLoaded={onLoaded} />
      
      {/* Orbit controls (disabled for thumbnails to prevent interference) */}
      <OrbitControls 
        enabled={false}
        autoRotate={false}
      />
    </>
  );
}

export const Model3DThumbnail = ({ modelId, filePath, className = "" }: Model3DThumbnailProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !modelUrl && !isLoading) {
          setIsVisible(true);
          loadModel();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [modelUrl, isLoading]);

  const loadModel = async () => {
    setIsLoading(true);
    setError(false);
    
    try {
      const { data, error } = await supabase.storage
        .from('3d-models')
        .download(filePath);
      
      if (error) throw error;
      
      const url = URL.createObjectURL(data);
      setModelUrl(url);
    } catch (err) {
      console.error('Error loading model for thumbnail:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelLoaded = () => {
    setIsLoading(false);
  };

  // Cleanup blob URL
  useEffect(() => {
    return () => {
      if (modelUrl) {
        URL.revokeObjectURL(modelUrl);
      }
    };
  }, [modelUrl]);

  if (error) {
    return (
      <div 
        ref={containerRef}
        className={`w-full h-full bg-muted rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="text-xs text-muted-foreground text-center p-2">
          Preview<br/>unavailable
        </div>
      </div>
    );
  }

  if (!isVisible || !modelUrl) {
    return (
      <div 
        ref={containerRef}
        className={`w-full h-full bg-muted rounded-lg flex items-center justify-center ${className}`}
      >
        {isLoading ? (
          <div className="text-xs text-muted-foreground">Loading...</div>
        ) : (
          <div className="text-xs text-muted-foreground">3D Preview</div>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 ${className}`}
    >
      <Canvas
        style={{ width: '100%', height: '100%' }}
        gl={{ 
          antialias: true, 
          alpha: true,
          preserveDrawingBuffer: false,
        }}
        dpr={window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio}
      >
        <Scene modelUrl={modelUrl} onLoaded={handleModelLoaded} />
      </Canvas>
      
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <div className="text-xs text-muted-foreground">Loading 3D...</div>
        </div>
      )}
    </div>
  );
};