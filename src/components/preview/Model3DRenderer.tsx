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
        console.log('=== MODEL3D RENDERER: Starting to load model ===');
        console.log('File URL:', fileUrl);
        console.log('File Type:', fileType);
        console.log('Expected STL extension:', fileType === 'stl');
        
        setLoading(true);
        
        // Load the model
        console.log('Model3DRenderer: About to call CADModelLoader.loadModel');
        const { geometry: loadedGeometry, materials: loadedMaterials } = await CADModelLoader.loadModel(fileUrl, fileType);
        console.log('Model3DRenderer: Model loaded successfully', { geometry: loadedGeometry, materials: loadedMaterials });
        
        // Process the geometry
        console.log('Model3DRenderer: Processing geometry');
        const processedGeometry = CADAnalyzer.processGeometry(loadedGeometry);
        console.log('Model3DRenderer: Geometry processed');
        
        // Clean the geometry to avoid prop conflicts
        const cleanGeometry = processedGeometry.clone();
        cleanGeometry.computeBoundingBox();
        cleanGeometry.computeBoundingSphere();
        
        // Analyze the geometry
        console.log('Model3DRenderer: Analyzing geometry');
        const analysisResult = CADAnalyzer.analyzeGeometry(processedGeometry);
        console.log('Model3DRenderer: Analysis complete', analysisResult);
        setAnalysis(analysisResult);
        onAnalysisComplete?.(analysisResult);

        setGeometry(cleanGeometry);
        setMaterials(loadedMaterials);
        setLoading(false);
        console.log('Model3DRenderer: Model loading complete');

      } catch (error) {
        console.error('Model3DRenderer loading error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        onLoadError?.(errorMessage);
        setLoading(false);
      }
    };

    if (fileUrl) {
      console.log('Model3DRenderer: fileUrl provided, starting load');
      loadModel();
    } else {
      console.log('Model3DRenderer: No fileUrl provided');
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

  // Create material based on mode - use React Three Fiber compatible approach
  const getMaterial = () => {
    if (wireframeMode) {
      return (
        <meshBasicMaterial 
          color="#00d4ff" 
          wireframe={true}
          transparent={true}
          opacity={0.8}
        />
      );
    }
    
    if (materials.length > 0) {
      // Use the loaded material directly
      return null; // Let Three.js handle the original material
    }
    
    return (
      <meshStandardMaterial 
        color="#666666"
        metalness={0.1}
        roughness={0.3}
      />
    );
  };

  return (
    <Center>
      <group ref={groupRef}>
        <mesh ref={meshRef} geometry={geometry}>
          {getMaterial()}
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