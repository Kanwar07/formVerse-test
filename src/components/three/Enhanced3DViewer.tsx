import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import { STLLoader } from 'three-stdlib';
import { PLYLoader } from 'three-stdlib';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RotateCcw, ZoomIn, ZoomOut, Move, RotateCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Enhanced3DViewerProps {
  modelUrl?: string;
  modelFile?: File;
  fileName?: string;
  fileType?: string;
  width?: number;
  height?: number;
  showControls?: boolean;
  autoRotate?: boolean;
  className?: string;
  onModelLoad?: (modelInfo: any) => void;
  onError?: (error: string) => void;
}

interface ModelInfo {
  vertices: number;
  faces: number;
  materials: number;
  boundingBox: {
    width: number;
    height: number;
    depth: number;
  };
  fileSize: string;
}

export const Enhanced3DViewer: React.FC<Enhanced3DViewerProps> = ({
  modelUrl,
  modelFile,
  fileName,
  fileType,
  width = 800,
  height = 600,
  showControls = true,
  autoRotate = false,
  className,
  onModelLoad,
  onError
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const modelRef = useRef<THREE.Group>();
  const animationIdRef = useRef<number>();
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [isDragging, setIsDragging] = useState(false);
  
  const { toast } = useToast();

  // Mouse interaction state
  const mouseRef = useRef({
    x: 0,
    y: 0,
    isDown: false
  });

  // Initialize Three.js scene
  const initScene = useCallback(() => {
    if (!containerRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    rendererRef.current = renderer;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x362D1D, 0.5);
    scene.add(hemisphereLight);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0xcccccc);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Append renderer to container
    containerRef.current.appendChild(renderer.domElement);

    // Add event listeners for mouse interactions
    addEventListeners();
  }, [width, height]);

  // Add event listeners for user interactions
  const addEventListeners = useCallback(() => {
    if (!rendererRef.current) return;

    const canvas = rendererRef.current.domElement;

    // Mouse down
    const handleMouseDown = (event: MouseEvent) => {
      mouseRef.current.isDown = true;
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
      setIsDragging(true);
      setIsRotating(false);
    };

    // Mouse move
    const handleMouseMove = (event: MouseEvent) => {
      if (!mouseRef.current.isDown || !modelRef.current) return;

      const deltaX = event.clientX - mouseRef.current.x;
      const deltaY = event.clientY - mouseRef.current.y;

      modelRef.current.rotation.y += deltaX * 0.01;
      modelRef.current.rotation.x += deltaY * 0.01;

      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };

    // Mouse up
    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
      setIsDragging(false);
    };

    // Mouse wheel for zooming
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (!cameraRef.current) return;

      const zoomSpeed = 0.1;
      const direction = event.deltaY > 0 ? 1 : -1;
      
      cameraRef.current.position.multiplyScalar(1 + direction * zoomSpeed);
      
      // Limit zoom range
      const distance = cameraRef.current.position.length();
      if (distance < 2) {
        cameraRef.current.position.normalize().multiplyScalar(2);
      } else if (distance > 50) {
        cameraRef.current.position.normalize().multiplyScalar(50);
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel);

    // Store cleanup function
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Load 3D model
  const loadModel = useCallback(async () => {
    if (!sceneRef.current) return;

    setIsLoading(true);
    setError(null);
    setLoadingProgress(0);

    let fileUrl: string | null = null;

    try {
      let loader;
      let actualFileName: string;
      
      // Handle File object or URL
      if (modelFile) {
        fileUrl = URL.createObjectURL(modelFile);
        actualFileName = modelFile.name;
      } else if (modelUrl) {
        fileUrl = modelUrl;
        actualFileName = fileName || 'model';
      } else {
        throw new Error('No model file or URL provided');
      }
      
      const extension = fileType?.toLowerCase() || actualFileName.split('.').pop()?.toLowerCase();

      // Choose appropriate loader based on file type
      switch (extension) {
        case 'gltf':
        case 'glb':
          loader = new GLTFLoader();
          break;
        case 'obj':
          loader = new OBJLoader();
          break;
        case 'stl':
          loader = new STLLoader();
          break;
        case 'ply':
          loader = new PLYLoader();
          break;
        default:
          throw new Error(`Unsupported file format: ${extension}`);
      }

      // Load model with progress tracking
      loader.load(
        fileUrl,
        (loadedModel: any) => {
          // Remove previous model
          if (modelRef.current) {
            sceneRef.current?.remove(modelRef.current);
          }

          let model: THREE.Group;

          // Handle different loader return types
          if (loadedModel.scene) {
            // GLTF loader returns { scene, ... }
            model = loadedModel.scene;
          } else if (loadedModel.isBufferGeometry) {
            // STL/PLY loaders return geometry
            const material = new THREE.MeshLambertMaterial({ 
              color: 0x888888,
              side: THREE.DoubleSide
            });
            const mesh = new THREE.Mesh(loadedModel, material);
            model = new THREE.Group();
            model.add(mesh);
          } else {
            // OBJ loader returns object
            model = loadedModel;
          }

          // Center and scale model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 4 / maxDim;
          
          model.scale.setScalar(scale);
          model.position.sub(center.multiplyScalar(scale));

          // Add to scene
          sceneRef.current?.add(model);
          modelRef.current = model;

          // Calculate model info
          const info: ModelInfo = {
            vertices: 0,
            faces: 0,
            materials: 0,
            boundingBox: {
              width: size.x,
              height: size.y,
              depth: size.z
            },
            fileSize: actualFileName
          };

          model.traverse((child: any) => {
            if (child.isMesh) {
              if (child.geometry) {
                info.vertices += child.geometry.attributes.position?.count || 0;
                info.faces += (child.geometry.index?.count || child.geometry.attributes.position?.count || 0) / 3;
              }
              if (child.material) {
                info.materials++;
              }
            }
          });

          setModelInfo(info);
          onModelLoad?.(info);
          setIsLoading(false);
          
          toast({
            title: "Model loaded successfully!",
            description: `${info.vertices.toLocaleString()} vertices, ${Math.floor(info.faces).toLocaleString()} faces`,
          });
        },
        (progress) => {
          if (progress.lengthComputable) {
            const percentComplete = (progress.loaded / progress.total) * 100;
            setLoadingProgress(percentComplete);
          }
        },
        (error) => {
          const errorMessage = `Failed to load model: ${error.message}`;
          setError(errorMessage);
          setIsLoading(false);
          onError?.(errorMessage);
          
          toast({
            title: "Failed to load model",
            description: errorMessage,
            variant: "destructive"
          });
        }
      );
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error occurred';
      setError(errorMessage);
      setIsLoading(false);
      onError?.(errorMessage);
    } finally {
      // Clean up object URL if we created one
      if (modelFile && fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    }
  }, [modelUrl, modelFile, fileName, fileType, onModelLoad, onError, toast]);

  // Animation loop
  const animate = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    // Auto-rotate model if enabled and not being dragged
    if (isRotating && !isDragging && modelRef.current) {
      modelRef.current.rotation.y += 0.005;
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationIdRef.current = requestAnimationFrame(animate);
  }, [isRotating, isDragging]);

  // Control functions
  const resetView = () => {
    if (cameraRef.current && modelRef.current) {
      cameraRef.current.position.set(5, 5, 5);
      cameraRef.current.lookAt(0, 0, 0);
      modelRef.current.rotation.set(0, 0, 0);
    }
  };

  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };

  const zoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(0.8);
    }
  };

  const zoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(1.2);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !containerRef.current) return;
      
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize scene on mount
  useEffect(() => {
    initScene();
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [initScene]);

  // Load model when URL or file changes
  useEffect(() => {
    if ((modelUrl || modelFile) && sceneRef.current) {
      loadModel();
    }
  }, [modelUrl, modelFile, loadModel]);

  // Start animation loop
  useEffect(() => {
    animate();
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [animate]);

  return (
    <Card className="w-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">3D Model Preview</h3>
          {modelInfo && (
            <div className="flex gap-2">
              <Badge variant="secondary">
                {modelInfo.vertices.toLocaleString()} vertices
              </Badge>
              <Badge variant="secondary">
                {Math.floor(modelInfo.faces).toLocaleString()} faces
              </Badge>
            </div>
          )}
        </div>

        {showControls && (
          <div className="flex gap-2 mb-4 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={resetView}
              disabled={isLoading}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleRotation}
              disabled={isLoading}
            >
              <RotateCw className="w-4 h-4 mr-1" />
              {isRotating ? 'Stop Rotation' : 'Auto Rotate'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={zoomIn}
              disabled={isLoading}
            >
              <ZoomIn className="w-4 h-4 mr-1" />
              Zoom In
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={zoomOut}
              disabled={isLoading}
            >
              <ZoomOut className="w-4 h-4 mr-1" />
              Zoom Out
            </Button>
          </div>
        )}

        <div 
          ref={containerRef}
          className={`relative border rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 ${className || ''}`}
          style={{ width, height }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-600">Loading 3D model...</p>
                {loadingProgress > 0 && (
                  <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50">
              <div className="text-center p-4">
                <p className="text-red-600 font-medium">Failed to load model</p>
                <p className="text-sm text-red-500 mt-1">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadModel}
                  className="mt-2"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {!isLoading && !error && (
            <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white bg-opacity-80 px-2 py-1 rounded">
              <Move className="w-3 h-3 inline mr-1" />
              Click and drag to rotate • Scroll to zoom
            </div>
          )}
        </div>

        {modelInfo && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Width</p>
              <p className="font-medium">{modelInfo.boundingBox.width.toFixed(2)} units</p>
            </div>
            <div>
              <p className="text-gray-500">Height</p>
              <p className="font-medium">{modelInfo.boundingBox.height.toFixed(2)} units</p>
            </div>
            <div>
              <p className="text-gray-500">Depth</p>
              <p className="font-medium">{modelInfo.boundingBox.depth.toFixed(2)} units</p>
            </div>
            <div>
              <p className="text-gray-500">Materials</p>
              <p className="font-medium">{modelInfo.materials}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};