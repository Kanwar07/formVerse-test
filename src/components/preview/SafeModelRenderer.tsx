import React, { useEffect, useRef, useState } from 'react';
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
  const [renderError, setRenderError] = useState<string | null>(null);

  console.log('SafeModelRenderer: Component initialized with:', {
    model: !!model,
    hasGeometry: !!model?.geometry,
    hasAttributes: !!model?.geometry?.attributes,
    hasPosition: !!model?.geometry?.attributes?.position,
    positionCount: model?.geometry?.attributes?.position?.count,
    materialsLength: model?.materials?.length,
    materialsType: Array.isArray(model?.materials) ? 'array' : typeof model?.materials,
    wireframeMode,
    autoRotate
  });

  // Animation effect
  useEffect(() => {
    if (!autoRotate) return;
    
    const animate = () => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.005;
        requestAnimationFrame(animate);
      }
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [autoRotate]);

  // Comprehensive validation
  if (!model) {
    console.error('SafeModelRenderer: No model provided');
    setRenderError('No model provided');
    return null;
  }

  if (!model.geometry) {
    console.error('SafeModelRenderer: No geometry in model:', model);
    setRenderError('No geometry in model');
    return null;
  }

  if (!model.geometry.attributes) {
    console.error('SafeModelRenderer: No attributes in geometry:', model.geometry);
    setRenderError('No attributes in geometry');
    return null;
  }

  if (!model.geometry.attributes.position) {
    console.error('SafeModelRenderer: No position attribute in geometry:', model.geometry.attributes);
    setRenderError('No position attribute in geometry');
    return null;
  }

  if (!model.materials || !Array.isArray(model.materials) || model.materials.length === 0) {
    console.error('SafeModelRenderer: Invalid materials:', model.materials);
    setRenderError('Invalid materials');
    return null;
  }

  // Create safe geometry with proper validation
  const createSafeGeometry = (): THREE.BufferGeometry => {
    console.log('SafeModelRenderer: Creating safe geometry from:', {
      originalGeometry: !!model.geometry,
      hasPosition: !!model.geometry.attributes.position,
      positionCount: model.geometry.attributes.position?.count
    });

    try {
      // Clone the original geometry to avoid modifying the source
      const geometry = model.geometry.clone();
      
      // Validate position attribute
      if (!geometry.attributes.position || geometry.attributes.position.count === 0) {
        console.error('SafeModelRenderer: Invalid position attribute');
        throw new Error('Invalid position attribute');
      }
      
      console.log('SafeModelRenderer: Geometry validation passed, processing...');
      
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
      console.error('SafeModelRenderer: Error creating geometry:', error);
      
      // Create minimal fallback geometry
      const fallbackGeometry = new THREE.BoxGeometry(1, 1, 1);
      delete (fallbackGeometry as any).lov;
      delete (fallbackGeometry as any)._listeners;
      
      return fallbackGeometry;
    }
  };

  // Create safe material with comprehensive validation
  const createSafeMaterial = (): THREE.Material => {
    console.log('SafeModelRenderer: Creating safe material from:', {
      materialsArray: Array.isArray(model.materials),
      materialsLength: model.materials?.length,
      firstMaterial: !!model.materials?.[0],
      wireframeMode
    });

    try {
      // Use the first material if available and valid
      const sourceMaterial = model.materials[0];
      
      console.log('SafeModelRenderer: Source material details:', {
        sourceMaterial: !!sourceMaterial,
        isThreeMaterial: sourceMaterial instanceof THREE.Material,
        materialType: sourceMaterial?.constructor?.name
      });

      if (wireframeMode) {
        console.log('SafeModelRenderer: Creating wireframe material');
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
        
        console.log('SafeModelRenderer: Wireframe material created');
        return material;
      }
      
      // Create a standard material for solid rendering
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
      
      console.log('SafeModelRenderer: Standard material created');
      return material;
      
    } catch (error) {
      console.error('SafeModelRenderer: Error creating material:', error);
      
      // Ultimate fallback material
      const fallbackMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6666,
        side: THREE.DoubleSide
      });
      
      delete (fallbackMaterial as any).lov;
      delete (fallbackMaterial as any)._listeners;
      fallbackMaterial.needsUpdate = true;
      
      console.log('SafeModelRenderer: Fallback material created');
      return fallbackMaterial;
    }
  };

  // Show error state if we have render errors
  if (renderError) {
    console.error('SafeModelRenderer: Render error state:', renderError);
    return (
      <Center>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
      </Center>
    );
  }

  console.log('SafeModelRenderer: Starting render process...');

  // Create geometry and material safely
  let safeGeometry: THREE.BufferGeometry;
  let safeMaterial: THREE.Material;

  try {
    console.log('SafeModelRenderer: Creating geometry and material...');
    safeGeometry = createSafeGeometry();
    safeMaterial = createSafeMaterial();

    // Final validation before rendering
    if (!safeGeometry || !safeGeometry.attributes?.position) {
      console.error('SafeModelRenderer: Invalid geometry after creation');
      throw new Error('Invalid geometry');
    }

    if (!safeMaterial) {
      console.error('SafeModelRenderer: Invalid material after creation');
      throw new Error('Invalid material');
    }

    console.log('SafeModelRenderer: Successfully created geometry and material, rendering mesh');

    // Create the mesh outside of JSX to avoid React Three Fiber issues
    const mesh = new THREE.Mesh(safeGeometry, safeMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    // Clean up any potentially problematic properties
    delete (mesh as any).lov;
    delete (mesh as any)._listeners;
    
    console.log('SafeModelRenderer: Mesh created successfully, rendering...');

    return (
      <Center>
        <primitive object={mesh} ref={meshRef} />
      </Center>
    );
  } catch (error) {
    console.error('SafeModelRenderer render error:', error);
    setRenderError(error instanceof Error ? error.message : 'Unknown render error');
    
    // Return fallback mesh
    return (
      <Center>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshBasicMaterial color="#ffaa00" />
        </mesh>
      </Center>
    );
  }
};