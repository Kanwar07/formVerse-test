import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF, Center } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Upload, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

// Hero model component with auto-rotation
function HeroModel() {
  const meshRef = useRef<THREE.Group>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  // Auto-rotation animation
  useFrame((state, delta) => {
    if (meshRef.current && !isPaused) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  // Pause on tab blur
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <Center>
      <group ref={meshRef} scale={[1.5, 1.5, 1.5]}>
        {/* Fallback geometry when no GLB is available */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial 
            color="hsl(var(--primary))" 
            metalness={0.8}
            roughness={0.2}
            emissive="hsl(var(--primary))"
            emissiveIntensity={0.1}
          />
        </mesh>
        <mesh position={[0, 2.5, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.8, 1.5, 8]} />
          <meshStandardMaterial 
            color="hsl(var(--accent))"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>
    </Center>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <Center>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hsl(var(--muted))" />
      </mesh>
    </Center>
  );
}

export function Hero3D() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90" />
      <div className="absolute inset-0 elegant-grid opacity-30" />
      <div className="absolute inset-0 elegant-particles" />
      
      {/* Content container */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
                <span className="block text-foreground elegant-text-glow">Rendered CAD,</span>
                <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  In Every Genre.
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                Photoreal animations for product, architecture, automotive, apparel, 
                jewelry, furniture, and more.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="elegant-button text-lg px-8 py-4 h-auto"
                onClick={() => navigate('/discover')}
              >
                <Search className="mr-2 h-5 w-5" />
                Explore Models
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="elegant-glass border-white/20 hover:border-white/30 text-lg px-8 py-4 h-auto"
                onClick={() => navigate('/upload')}
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload CAD
              </Button>
            </div>

            {/* Performance stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">60fps</div>
                <div>Smooth Playback</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">2.5s</div>
                <div>Load Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">10+</div>
                <div>File Formats</div>
              </div>
            </div>
          </div>

          {/* 3D Model Viewer */}
          <div className="relative h-96 lg:h-[600px] w-full">
            <div className="absolute inset-0 elegant-glass rounded-3xl overflow-hidden">
              <Canvas
                camera={{ position: [0, 0, 6], fov: 45 }}
                gl={{ 
                  antialias: true, 
                  alpha: true,
                  powerPreference: "high-performance"
                }}
                dpr={[1, 2]}
                performance={{ min: 0.5 }}
              >
                {/* Lighting setup with HDRI-style environment */}
                <ambientLight intensity={0.2} />
                <directionalLight 
                  position={[5, 5, 5]} 
                  intensity={1}
                  castShadow
                  shadow-mapSize={[2048, 2048]}
                />
                <pointLight position={[-5, -5, -5]} intensity={0.5} color="hsl(var(--accent))" />
                
                {/* Environment for reflections */}
                <Environment preset="studio" />
                
                {/* Contact shadows */}
                <ContactShadows
                  rotation={[Math.PI / 2, 0, 0]}
                  position={[0, -3, 0]}
                  opacity={0.4}
                  width={10}
                  height={10}
                  blur={1}
                  far={4}
                />

                {/* Main 3D model */}
                <Suspense fallback={<LoadingFallback />}>
                  <HeroModel />
                </Suspense>

                {/* Disabled orbit controls for auto-rotation */}
                <OrbitControls 
                  enabled={false}
                  enableZoom={false}
                  enablePan={false}
                  enableRotate={false}
                />
              </Canvas>
            </div>
            
            {/* Floating UI elements */}
            <div className="absolute top-4 left-4 elegant-glass px-3 py-2 rounded-full text-sm text-muted-foreground">
              Auto-rotating • 3D Model
            </div>
            
            <div className="absolute bottom-4 right-4 elegant-glass px-3 py-2 rounded-full text-sm text-muted-foreground">
              WebGL Powered
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}