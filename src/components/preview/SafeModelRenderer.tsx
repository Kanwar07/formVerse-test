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

  // Validate model data
  if (!model || !model.geometry) {
    console.error('SafeModelRenderer: Invalid model data');
    return (
      <Center>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
      </Center>
    );
  }

  // Validate geometry
  if (!model.geometry.attributes || !model.geometry.attributes.position) {
    console.error('SafeModelRenderer: Invalid geometry attributes');
    return (
      <Center>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ff4444" />
        </mesh>
      </Center>
    );
  }

  // Create safe material with comprehensive null checks
  const createSafeMaterial = () => {
    try {
      if (wireframeMode) {
        return (
          <meshBasicMaterial 
            color="#00d4ff" 
            wireframe={true}
            transparent={true}
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        );
      }
      
      // Always create fresh materials to avoid serialization issues
      // Don't try to reuse the original materials as they may have lost their methods
      // after being passed through React state/props
      
      // Use a default material appropriate for CAD models
      return (
        <meshStandardMaterial 
          color="#888888"
          metalness={0.1}
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      );
    } catch (error) {
      console.error('Error creating material:', error);
      return (
        <meshBasicMaterial 
          color="#ff6666"
          side={THREE.DoubleSide}
        />
      );
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

  // Create geometry and material safely
  let safeGeometry: THREE.BufferGeometry;
  let safeMaterial: React.ReactElement;

  try {
    safeGeometry = createSafeGeometry();
    safeMaterial = createSafeMaterial();

    // Final validation before rendering
    if (!safeGeometry || !safeGeometry.attributes?.position) {
      console.error('SafeModelRenderer: Invalid geometry after creation');
      throw new Error('Invalid geometry');
    }

    return (
      <Center>
        <mesh ref={meshRef} geometry={safeGeometry}>
          {safeMaterial}
        </mesh>
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