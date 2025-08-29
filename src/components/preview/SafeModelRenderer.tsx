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

  // Comprehensive validation - fail early if anything is invalid
  if (!model) {
    console.error('SafeModelRenderer: No model provided');
    return null;
  }

  if (!model.geometry) {
    console.error('SafeModelRenderer: No geometry in model:', model);
    return null;
  }

  if (!model.geometry.attributes) {
    console.error('SafeModelRenderer: No attributes in geometry:', model.geometry);
    return null;
  }

  if (!model.geometry.attributes.position) {
    console.error('SafeModelRenderer: No position attribute in geometry:', model.geometry.attributes);
    return null;
  }

  if (!model.materials || !Array.isArray(model.materials) || model.materials.length === 0) {
    console.error('SafeModelRenderer: No valid materials array:', model.materials);
    return null;
  }

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
      
      // Validate the cloned geometry
      if (!geometry.attributes.position) {
        throw new Error('Cloned geometry missing position attribute');
      }
      
      console.log('SafeModelRenderer: Safe geometry created successfully');
      return geometry;
      
    } catch (error) {
      console.error('SafeModelRenderer: Error processing geometry:', error);
      // Return a fallback geometry instead of null
      const fallbackGeometry = new THREE.BoxGeometry(1, 1, 1);
      fallbackGeometry.computeVertexNormals();
      return fallbackGeometry;
    }
  }, [model.geometry]);

  // Create safe material using useMemo for better performance and stability
  const safeMaterial = useMemo(() => {
    try {
      console.log('SafeModelRenderer: Creating material with wireframeMode:', wireframeMode);
      
      let baseMaterial = model.materials[0];
      
      // Validate base material
      if (!baseMaterial || typeof baseMaterial !== 'object') {
        console.warn('SafeModelRenderer: Invalid base material, creating fallback');
        baseMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
      }
      
      let material: THREE.Material;
      
      if (wireframeMode) {
        material = new THREE.MeshBasicMaterial({
          color: 0x00d4ff,
          wireframe: true,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide
        });
      } else {
        // Clone the original material or create a new one
        if (baseMaterial instanceof THREE.Material) {
          material = baseMaterial.clone();
          material.side = THREE.DoubleSide;
        } else {
          material = new THREE.MeshStandardMaterial({
            color: 0x888888,
            metalness: 0.1,
            roughness: 0.3,
            side: THREE.DoubleSide
          });
        }
      }
      
      // Clean up any potentially problematic properties
      delete (material as any).lov;
      delete (material as any)._listeners;
      
      // Mark material for proper React Three Fiber handling
      material.needsUpdate = true;
      
      // Validate material before returning
      if (!material || typeof material !== 'object') {
        throw new Error('Failed to create valid material');
      }
      
      console.log('SafeModelRenderer: Safe material created successfully');
      return material;
    } catch (error) {
      console.error('SafeModelRenderer: Error creating material:', error);
      // Return a safe fallback material
      const fallbackMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
      fallbackMaterial.needsUpdate = true;
      return fallbackMaterial;
    }
  }, [wireframeMode, model.materials]);

  // Final validation before render
  if (!safeGeometry || !safeMaterial) {
    console.error('SafeModelRenderer: Failed to create safe geometry or material');
    return null;
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