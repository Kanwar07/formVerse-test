import React, { useState, useRef } from 'react';
import { Center } from '@react-three/drei';
import * as THREE from 'three';
import { LoadedCADModel } from './UniversalCADLoader';

interface SafeModelRendererProps {
  model: LoadedCADModel;
  wireframeMode: boolean;
  autoRotate: boolean;
}

export const SafeModelRenderer = ({ 
  model, 
  wireframeMode, 
  autoRotate 
}: SafeModelRendererProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  // Auto rotation effect
  React.useEffect(() => {
    if (!meshRef.current || !autoRotate) return;
    
    const animate = () => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.005;
        requestAnimationFrame(animate);
      }
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [autoRotate]);

  // Early validation - return error state immediately if model is invalid
  if (!model) {
    console.error('SafeModelRenderer: No model provided');
    return (
      <Center>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
      </Center>
    );
  }

  if (!model.geometry) {
    console.error('SafeModelRenderer: Model has no geometry');
    return (
      <Center>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ff4444" />
        </mesh>
      </Center>
    );
  }

  // Validate geometry attributes
  if (!model.geometry.attributes || !model.geometry.attributes.position) {
    console.error('SafeModelRenderer: Geometry missing position attributes');
    return (
      <Center>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ff8888" />
        </mesh>
      </Center>
    );
  }

  // Validate position array
  if (!model.geometry.attributes.position.array || model.geometry.attributes.position.array.length === 0) {
    console.error('SafeModelRenderer: Position attribute has no data');
    return (
      <Center>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ffaaaa" />
        </mesh>
      </Center>
    );
  }

  // Create safe material with comprehensive null checks
  const createSafeMaterial = () => {
    try {
      console.log('SafeModelRenderer: Creating material, wireframeMode:', wireframeMode);
      
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
      
      return fallbackMaterial;
    }
  };

  // Create safe geometry with error handling
  const createSafeGeometry = () => {
    try {
      // Multiple layers of validation
      if (!model || !model.geometry) {
        console.error('SafeModelRenderer: No geometry found in model');
        return new THREE.BoxGeometry(1, 1, 1);
      }

      // Validate essential geometry attributes
      const positionAttr = model.geometry.attributes?.position;
      if (!positionAttr || !positionAttr.array || positionAttr.array.length === 0) {
        console.error('SafeModelRenderer: Invalid position attribute');
        return new THREE.BoxGeometry(1, 1, 1);
      }

      // Create a completely new geometry to avoid any reference issues
      const geometry = new THREE.BufferGeometry();
      
      // Safely copy position attribute
      try {
        const positions = new Float32Array(positionAttr.array);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      } catch (error) {
        console.error('SafeModelRenderer: Failed to copy position attribute:', error);
        return new THREE.BoxGeometry(1, 1, 1);
      }
      
      // Safely copy normal attribute if it exists and is valid
      try {
        if (model.geometry.attributes?.normal && 
            model.geometry.attributes.normal.array && 
            model.geometry.attributes.normal.array.length > 0) {
          const normals = new Float32Array(model.geometry.attributes.normal.array);
          geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
        } else {
          geometry.computeVertexNormals();
        }
      } catch (error) {
        console.warn('SafeModelRenderer: Failed to copy normals, computing instead:', error);
        geometry.computeVertexNormals();
      }
      
      // Safely copy UV attribute if it exists and is valid
      try {
        if (model.geometry.attributes?.uv && 
            model.geometry.attributes.uv.array && 
            model.geometry.attributes.uv.array.length > 0) {
          const uvs = new Float32Array(model.geometry.attributes.uv.array);
          geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        }
      } catch (error) {
        console.warn('SafeModelRenderer: Failed to copy UV coordinates:', error);
        // UV is optional, continue without it
      }
      
      // Safely copy index if it exists
      try {
        if (model.geometry.index && model.geometry.index.array) {
          const indices = new Uint32Array(model.geometry.index.array);
          geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        }
      } catch (error) {
        console.warn('SafeModelRenderer: Failed to copy indices:', error);
        // Index is optional, continue without it
      }
      
      // Compute bounds safely
      try {
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
      } catch (error) {
        console.warn('SafeModelRenderer: Failed to compute bounds:', error);
        // Bounds computation failed, but geometry might still be usable
      }
      
      // Final validation
      if (!geometry.attributes.position) {
        console.error('SafeModelRenderer: Geometry creation failed - no position attribute');
        return new THREE.BoxGeometry(1, 1, 1);
      }
      
      return geometry;
    } catch (error) {
      console.error('SafeModelRenderer: Error creating safe geometry:', error);
      return new THREE.BoxGeometry(1, 1, 1);
    }
  };

  // Handle render errors
  if (renderError) {
    return (
      <Center>
        <mesh>
          <boxGeometry args={[2, 0.5, 0.1]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
      </Center>
    );
  }

  // Create geometry and material safely with primitive objects
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

    return (
      <Center>
        <primitive object={(() => {
          const mesh = new THREE.Mesh(safeGeometry, safeMaterial);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          
          // Clean up any potentially problematic properties
          delete (mesh as any).lov;
          delete (mesh as any)._listeners;
          
          return mesh;
        })()} ref={meshRef} />
      </Center>
    );
  } catch (error) {
    console.error('SafeModelRenderer render error:', error);
    setRenderError(error instanceof Error ? error.message : 'Unknown render error');
    
    return (
      <Center>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
      </Center>
    );
  }
};