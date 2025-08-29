import React, { useEffect, useRef, useMemo } from 'react';
import { Center } from '@react-three/drei';
import * as THREE from 'three';
import { LoadedCADModel } from './UniversalCADLoader';

interface SafeModelRendererProps {
  model: LoadedCADModel;
  wireframeMode?: boolean;
  autoRotate?: boolean;
}

export const SafeModelRenderer = ({ 
  model, 
  wireframeMode = false, 
  autoRotate = false 
}: SafeModelRendererProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  console.log('SafeModelRenderer: Component initialized with:', {
    model: !!model,
    hasGeometry: !!model?.geometry,
    hasAttributes: !!model?.geometry?.attributes,
    hasPosition: !!model?.geometry?.attributes?.position,
    positionCount: model?.geometry?.attributes?.position?.count,
    materialsLength: model?.materials?.length,
    wireframeMode,
    autoRotate
  });

  // Animation effect
  useEffect(() => {
    if (!autoRotate || !meshRef.current) return;
    
    const animate = () => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.005;
        requestAnimationFrame(animate);
      }
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [autoRotate]);

  // Create safe geometry using useMemo for better performance and stability
  const safeGeometry = useMemo(() => {
    if (!model?.geometry?.attributes?.position) {
      console.error('SafeModelRenderer: Invalid geometry, creating fallback');
      return new THREE.BoxGeometry(1, 1, 1);
    }

    try {
      console.log('SafeModelRenderer: Cloning and processing geometry');
      const geometry = model.geometry.clone();
      
      // Ensure we have normals for proper lighting
      if (!geometry.attributes.normal) {
        console.log('SafeModelRenderer: Computing normals');
        geometry.computeVertexNormals();
      }
      
      // Clean up any potentially problematic properties
      delete (geometry as any).lov;
      delete (geometry as any)._listeners;
      
      console.log('SafeModelRenderer: Safe geometry created successfully');
      return geometry;
      
    } catch (error) {
      console.error('SafeModelRenderer: Error processing geometry:', error);
      return new THREE.BoxGeometry(1, 1, 1);
    }
  }, [model?.geometry]);

  // Create safe material using useMemo for better performance and stability
  const safeMaterial = useMemo(() => {
    console.log('SafeModelRenderer: Creating material with wireframeMode:', wireframeMode);
    
    if (wireframeMode) {
      const material = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      
      // Clean up any potentially problematic properties
      delete (material as any).lov;
      delete (material as any)._listeners;
      material.needsUpdate = true;
      
      return material;
    }
    
    const material = new THREE.MeshStandardMaterial({
      color: 0x888888,
      metalness: 0.1,
      roughness: 0.3,
      side: THREE.DoubleSide
    });
    
    // Clean up any potentially problematic properties
    delete (material as any).lov;
    delete (material as any)._listeners;
    material.needsUpdate = true;
    
    return material;
  }, [wireframeMode]);

  // Comprehensive validation
  if (!model) {
    console.error('SafeModelRenderer: No model provided');
    return (
      <Center>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
      </Center>
    );
  }

  if (!model.geometry) {
    console.error('SafeModelRenderer: No geometry in model:', model);
    return (
      <Center>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#ff6666" />
        </mesh>
      </Center>
    );
  }

  if (!model.geometry.attributes) {
    console.error('SafeModelRenderer: No attributes in geometry:', model.geometry);
    return (
      <Center>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#ffaa66" />
        </mesh>
      </Center>
    );
  }

  if (!model.geometry.attributes.position) {
    console.error('SafeModelRenderer: No position attribute in geometry:', model.geometry.attributes);
    return (
      <Center>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#ffff66" />
        </mesh>
      </Center>
    );
  }

  console.log('SafeModelRenderer: Rendering with native React Three Fiber elements');

  // Use React Three Fiber's native JSX elements instead of primitive objects
  // This should prevent the "lov" property access issues
  return (
    <Center>
      <mesh 
        ref={meshRef}
        geometry={safeGeometry}
        material={safeMaterial}
        castShadow={true}
        receiveShadow={true}
      />
    </Center>
  );
};