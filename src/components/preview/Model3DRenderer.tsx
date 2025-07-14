import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center, Edges, Html } from '@react-three/drei';
import * as THREE from 'three';
import { CADModelLoader } from './CADModelLoader';
import { CADAnalyzer, CADAnalysisResult } from './CADAnalyzer';

interface Model3DRendererProps {
  fileUrl: string;
  fileType: string;
  onAnalysisComplete?: (analysis: CADAnalysisResult) => void;
  onLoadError?: (error: string) => void;
  wireframeMode?: boolean;
  showIssues?: boolean;
}

export const Model3DRenderer = ({ 
  fileUrl, 
  fileType, 
  onAnalysisComplete, 
  onLoadError,
  wireframeMode = false,
  showIssues = false 
}: Model3DRendererProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [materials, setMaterials] = useState<THREE.Material[]>([]);
  const [analysis, setAnalysis] = useState<CADAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        
        // Load the model
        const { geometry: loadedGeometry, materials: loadedMaterials } = await CADModelLoader.loadModel(fileUrl, fileType);
        
        // Process the geometry
        const processedGeometry = CADAnalyzer.processGeometry(loadedGeometry);
        
        // Analyze the geometry
        const analysisResult = CADAnalyzer.analyzeGeometry(processedGeometry);
        setAnalysis(analysisResult);
        onAnalysisComplete?.(analysisResult);

        setGeometry(processedGeometry);
        setMaterials(loadedMaterials);
        setLoading(false);

      } catch (error) {
        console.error('Model3DRenderer loading error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        onLoadError?.(errorMessage);
        setLoading(false);
      }
    };

    if (fileUrl) {
      loadModel();
    }
  }, [fileUrl, fileType, onAnalysisComplete, onLoadError]);

  // Render loading state
  if (loading || !geometry) {
    return (
      <mesh>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color="#888888" transparent opacity={0.3} />
      </mesh>
    );
  }

  // Create material based on mode
  const material = wireframeMode
    ? new THREE.MeshBasicMaterial({ 
        color: '#00d4ff', 
        wireframe: true,
        transparent: true,
        opacity: 0.8
      })
    : materials.length > 0 
      ? materials[0]
      : new THREE.MeshStandardMaterial({ 
          color: '#666666',
          metalness: 0.1,
          roughness: 0.3
        });

  return (
    <Center>
      <group ref={groupRef}>
        <mesh ref={meshRef} geometry={geometry} material={material}>
          {showIssues && analysis?.issues.length > 0 && (
            <Edges threshold={15} color="#ff4444" />
          )}
        </mesh>
        
        {/* Issue visualization */}
        {showIssues && analysis?.issues.map((issue, index) => (
          <Html
            key={index}
            position={[2, 2 - index * 0.5, 0]}
            distanceFactor={10}
            occlude={false}
          >
            <div className="bg-destructive/90 text-destructive-foreground px-2 py-1 rounded text-xs">
              {issue.type}: {issue.count}
            </div>
          </Html>
        ))}
      </group>
    </Center>
  );
};