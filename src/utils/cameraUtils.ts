import * as THREE from 'three';

/**
 * Camera positioning utility for consistent 3D model framing
 * Automatically calculates optimal camera position and settings based on model bounding box
 */

export interface OptimalCameraSettings {
  position: [number, number, number];
  target: [number, number, number];
  distance: number;
  fov: number;
  near: number;
  far: number;
}

export interface ModelBounds {
  min: THREE.Vector3;
  max: THREE.Vector3;
  center: THREE.Vector3;
  size: THREE.Vector3;
  maxDimension: number;
}

/**
 * Calculate model bounds from geometry or object
 */
export function calculateModelBounds(object: THREE.Object3D | THREE.BufferGeometry): ModelBounds {
  const box = new THREE.Box3();
  
  if (object instanceof THREE.BufferGeometry) {
    const position = object.attributes.position;
    if (position) {
      box.setFromBufferAttribute(position as THREE.BufferAttribute);
    }
  } else {
    box.setFromObject(object);
  }
  
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z);
  
  return {
    min: box.min.clone(),
    max: box.max.clone(),
    center,
    size,
    maxDimension
  };
}

/**
 * Calculate optimal camera settings for consistent model framing
 */
export function calculateOptimalCamera(
  bounds: ModelBounds,
  aspectRatio: number = 1,
  viewType: 'perspective' | 'isometric' = 'isometric',
  padding: number = 1.5 // Padding multiplier for framing
): OptimalCameraSettings {
  const { center, maxDimension } = bounds;
  
  // Base FOV for consistent framing
  const baseFov = 50;
  
  // Calculate optimal distance to fit model in viewport with padding
  const fovRadians = (baseFov * Math.PI) / 180;
  const baseDistance = (maxDimension * padding) / (2 * Math.tan(fovRadians / 2));
  
  // Adjust distance based on aspect ratio
  const distance = Math.max(baseDistance, maxDimension * 2);
  
  // Calculate camera position based on view type
  let cameraPosition: [number, number, number];
  
  if (viewType === 'isometric') {
    // Isometric view: 45-degree angles for professional CAD visualization
    const offset = distance * 0.7071; // sin(45°) = cos(45°) ≈ 0.7071
    cameraPosition = [
      center.x + offset,
      center.y + offset,
      center.z + offset
    ];
  } else {
    // Perspective view: slightly elevated front view
    cameraPosition = [
      center.x,
      center.y + distance * 0.3,
      center.z + distance
    ];
  }
  
  // Calculate near and far planes based on distance
  const near = Math.max(distance * 0.01, 0.1);
  const far = distance * 10;
  
  return {
    position: cameraPosition,
    target: [center.x, center.y, center.z],
    distance,
    fov: baseFov,
    near,
    far
  };
}

/**
 * Apply consistent scaling to a model for uniform appearance
 */
export function normalizeModelScale(
  object: THREE.Object3D,
  targetSize: number = 2 // Target maximum dimension
): number {
  const bounds = calculateModelBounds(object);
  const scaleFactor = targetSize / bounds.maxDimension;
  
  // Apply scaling
  object.scale.setScalar(scaleFactor);
  
  // Center the model
  object.position.copy(bounds.center.clone().negate().multiplyScalar(scaleFactor));
  
  return scaleFactor;
}

/**
 * Create a camera configuration for Three.js Canvas
 */
export function createCameraConfig(
  bounds: ModelBounds,
  aspectRatio: number = 1,
  viewType: 'perspective' | 'isometric' = 'isometric'
) {
  const cameraSettings = calculateOptimalCamera(bounds, aspectRatio, viewType);
  
  return {
    position: cameraSettings.position,
    fov: cameraSettings.fov,
    near: cameraSettings.near,
    far: cameraSettings.far,
    target: cameraSettings.target
  };
}

/**
 * Hook for React Three Fiber to auto-frame models
 */
export function useAutoFrameCamera(
  object: THREE.Object3D | null,
  camera: THREE.Camera,
  controls?: any
) {
  if (!object || !camera) return;
  
  const bounds = calculateModelBounds(object);
  const aspectRatio = camera instanceof THREE.PerspectiveCamera 
    ? camera.aspect 
    : 1;
  
  const cameraSettings = calculateOptimalCamera(bounds, aspectRatio);
  
  // Update camera position
  camera.position.set(...cameraSettings.position);
  
  // Update controls target if available
  if (controls && controls.target) {
    controls.target.set(...cameraSettings.target);
    if (controls.update) {
      controls.update();
    }
  }
  
  // For perspective cameras, update near/far planes
  if (camera instanceof THREE.PerspectiveCamera) {
    camera.near = cameraSettings.near;
    camera.far = cameraSettings.far;
    camera.updateProjectionMatrix();
  }
}

/**
 * Get standard camera positions for different view angles
 */
export function getStandardViewPositions(center: THREE.Vector3, distance: number) {
  return {
    front: [center.x, center.y, center.z + distance] as [number, number, number],
    back: [center.x, center.y, center.z - distance] as [number, number, number],
    left: [center.x - distance, center.y, center.z] as [number, number, number],
    right: [center.x + distance, center.y, center.z] as [number, number, number],
    top: [center.x, center.y + distance, center.z] as [number, number, number],
    bottom: [center.x, center.y - distance, center.z] as [number, number, number],
    isometric: [center.x + distance * 0.7071, center.y + distance * 0.7071, center.z + distance * 0.7071] as [number, number, number]
  };
}