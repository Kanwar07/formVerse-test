import * as THREE from 'three';

export interface CADAnalysisResult {
  vertices: number;
  faces: number;
  boundingBox: THREE.Box3;
  volume: number;
  surfaceArea: number;
  issues: {
    type: 'non-manifold' | 'inverted-normals' | 'degenerate-faces' | 'holes';
    severity: 'low' | 'medium' | 'high';
    count: number;
    description: string;
  }[];
  materials: string[];
  scale: THREE.Vector3;
  center: THREE.Vector3;
}

export class CADAnalyzer {
  static analyzeGeometry(geometry: THREE.BufferGeometry): CADAnalysisResult {
    const vertices = geometry.attributes.position ? geometry.attributes.position.count : 0;
    const faces = geometry.index ? geometry.index.count / 3 : vertices / 3;
    
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    
    const boundingBox = geometry.boundingBox!;
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    boundingBox.getSize(size);
    boundingBox.getCenter(center);

    // Basic volume calculation (approximation)
    const volume = size.x * size.y * size.z;
    
    // Surface area approximation
    let surfaceArea = 0;
    if (geometry.index) {
      const positions = geometry.attributes.position.array;
      const indices = geometry.index.array;
      
      for (let i = 0; i < indices.length; i += 3) {
        const a = new THREE.Vector3().fromArray(positions, indices[i] * 3);
        const b = new THREE.Vector3().fromArray(positions, indices[i + 1] * 3);
        const c = new THREE.Vector3().fromArray(positions, indices[i + 2] * 3);
        
        const ab = b.clone().sub(a);
        const ac = c.clone().sub(a);
        const cross = ab.cross(ac);
        surfaceArea += cross.length() * 0.5;
      }
    }

    // Issue detection (simplified)
    const issues: CADAnalysisResult['issues'] = [];
    
    // Check for degenerate faces
    if (faces < vertices / 10) {
      issues.push({
        type: 'degenerate-faces',
        severity: 'medium',
        count: Math.floor(vertices / 10 - faces),
        description: 'Some faces may be degenerate or have zero area'
      });
    }

    // Check normals
    if (!geometry.attributes.normal) {
      issues.push({
        type: 'inverted-normals',
        severity: 'low',
        count: 1,
        description: 'Normals need to be computed'
      });
    }

    return {
      vertices,
      faces: Math.floor(faces),
      boundingBox,
      volume,
      surfaceArea,
      issues,
      materials: ['Default Material'],
      scale: size,
      center
    };
  }

  static processGeometry(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
    // Process geometry
    geometry.computeBoundingBox();
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();

    // Center and scale geometry
    const box = geometry.boundingBox!;
    const center = new THREE.Vector3();
    box.getCenter(center);
    geometry.translate(-center.x, -center.y, -center.z);

    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDimension = Math.max(size.x, size.y, size.z);
    if (maxDimension > 0) {
      const scale = 4 / maxDimension; // Scale to fit in 4 unit cube
      geometry.scale(scale, scale, scale);
    }

    return geometry;
  }
}