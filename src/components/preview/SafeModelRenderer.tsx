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
      
      // Check if we have valid materials
      if (model.materials && Array.isArray(model.materials) && model.materials.length > 0) {
        const originalMaterial = model.materials[0];
        
        if (originalMaterial && originalMaterial instanceof THREE.Material) {
          // Extract safe properties from the original material
          if (originalMaterial instanceof THREE.MeshStandardMaterial) {
            return (
              <meshStandardMaterial 
                color={originalMaterial.color?.getHex?.() ? `#${originalMaterial.color.getHex().toString(16).padStart(6, '0')}` : "#888888"}
                metalness={typeof originalMaterial.metalness === 'number' ? originalMaterial.metalness : 0.1}
                roughness={typeof originalMaterial.roughness === 'number' ? originalMaterial.roughness : 0.3}
                side={THREE.DoubleSide}
              />
            );
          } else if (originalMaterial instanceof THREE.MeshPhongMaterial) {
            return (
              <meshPhongMaterial 
                color={originalMaterial.color?.getHex?.() ? `#${originalMaterial.color.getHex().toString(16).padStart(6, '0')}` : "#888888"}
                shininess={typeof originalMaterial.shininess === 'number' ? originalMaterial.shininess : 30}
                side={THREE.DoubleSide}
              />
            );
          } else if (originalMaterial instanceof THREE.MeshBasicMaterial) {
            return (
              <meshBasicMaterial 
                color={originalMaterial.color?.getHex?.() ? `#${originalMaterial.color.getHex().toString(16).padStart(6, '0')}` : "#888888"}
                side={THREE.DoubleSide}
              />
            );
          }
        }
      }
      
      // Default safe fallback material
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
      // Validate essential geometry attributes
      const positionAttr = model.geometry.attributes.position;
      if (!positionAttr || !positionAttr.array || positionAttr.array.length === 0) {
        throw new Error('Invalid position attribute');
      }

      // Create a clean geometry clone
      const geometry = new THREE.BufferGeometry();
      
      // Copy position attribute
      geometry.setAttribute('position', positionAttr.clone());
      
      // Copy normal attribute if it exists and is valid
      if (model.geometry.attributes.normal && model.geometry.attributes.normal.array.length > 0) {
        geometry.setAttribute('normal', model.geometry.attributes.normal.clone());
      } else {
        geometry.computeVertexNormals();
      }
      
      // Copy UV attribute if it exists and is valid
      if (model.geometry.attributes.uv && model.geometry.attributes.uv.array.length > 0) {
        geometry.setAttribute('uv', model.geometry.attributes.uv.clone());
      }
      
      // Copy index if it exists
      if (model.geometry.index) {
        geometry.setIndex(model.geometry.index.clone());
      }
      
      // Compute bounds
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      
      return geometry;
    } catch (error) {
      console.error('Error creating safe geometry:', error);
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

  try {
    const safeMaterial = createSafeMaterial();

    return (
      <Center>
        <mesh ref={meshRef}>
          <primitive 
            object={createSafeGeometry()} 
          />
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