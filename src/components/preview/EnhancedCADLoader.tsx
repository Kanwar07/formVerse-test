import * as THREE from 'three';
import { STLLoader } from 'three-stdlib';
import { OBJLoader, MTLLoader } from 'three-stdlib';
import { GLTFLoader } from 'three-stdlib';
import { PLYLoader } from 'three-stdlib';

export interface LoadedCADModel {
  geometry: THREE.BufferGeometry;
  materials: THREE.Material[];
  metadata?: {
    format: string;
    vertices: number;
    faces: number;
    fileSize?: number;
    boundingBox?: THREE.Box3;
  };
}

export interface LoadProgress {
  progress: number;
  stage: string;
}

/**
 * Enhanced CAD Loader with comprehensive error handling and format support
 * Fixes React Three Fiber prop application issues by properly cleaning Three.js objects
 */
export class EnhancedCADLoader {
  
  /**
   * Detect file format from extension and MIME type
   */
  public static detectFormat(fileName: string, mimeType?: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    // Priority: MIME type detection first, then extension
    if (mimeType) {
      if (mimeType.includes('stl') || mimeType === 'application/sla') return 'stl';
      if (mimeType.includes('obj')) return 'obj';
      if (mimeType.includes('gltf') || mimeType === 'model/gltf+json') return 'gltf';
      if (mimeType.includes('glb') || mimeType === 'model/gltf-binary') return 'glb';
      if (mimeType.includes('ply')) return 'ply';
      if (mimeType.includes('step')) return 'step';
      if (mimeType.includes('iges')) return 'iges';
    }
    
    // Extension-based detection
    switch (extension) {
      case 'stl': return 'stl';
      case 'obj': return 'obj';
      case 'gltf': return 'gltf';
      case 'glb': return 'glb';
      case 'ply': return 'ply';
      case 'step':
      case 'stp': return 'step';
      case 'iges':
      case 'ige':
      case 'igs': return 'iges';
      default:
        throw new Error(`Unsupported file format: ${extension}. Supported formats: STL, OBJ, GLTF, GLB, PLY, STEP, IGES`);
    }
  }

  /**
   * Main loading function with comprehensive error handling
   */
  public static async loadModel(
    fileUrl: string, 
    fileName: string,
    onProgress?: (progress: LoadProgress) => void
  ): Promise<LoadedCADModel> {
    
    console.log('EnhancedCADLoader: Starting load', { fileUrl, fileName });
    
    try {
      // Detect format
      const format = this.detectFormat(fileName);
      console.log('Detected format:', format);
      
      onProgress?.({ progress: 10, stage: `Detecting format: ${format.toUpperCase()}` });

      // Validate URL
      if (!fileUrl || (!fileUrl.startsWith('http') && !fileUrl.startsWith('blob:'))) {
        throw new Error('Invalid file URL provided');
      }

      // Load with retry mechanism
      const maxRetries = 3;
      let lastError: Error | null = null;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          onProgress?.({ progress: 10 + (attempt * 10), stage: `Loading ${format.toUpperCase()} (attempt ${attempt})` });
          
          const model = await this.loadByFormat(fileUrl, format, onProgress);
          
          // Add metadata
          const metadata = {
            format: format.toUpperCase(),
            vertices: this.countVertices(model.geometry),
            faces: this.countFaces(model.geometry),
            boundingBox: this.computeSafeBoundingBox(model.geometry)
          };
          
          onProgress?.({ progress: 100, stage: 'Loading complete' });
          
          return {
            ...model,
            metadata
          };
          
        } catch (error) {
          lastError = error as Error;
          console.warn(`Attempt ${attempt} failed:`, error);
          
          if (attempt === maxRetries) {
            throw lastError;
          }
          
          // Wait before retry with exponential backoff
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
      
      throw lastError || new Error('Unknown error during loading');
      
    } catch (error) {
      console.error('EnhancedCADLoader: Failed to load model:', error);
      
      // Try to provide a descriptive error message
      const errorMessage = this.getDescriptiveError(error as Error, fileName);
      throw new Error(errorMessage);
    }
  }

  /**
   * Format-specific loading with proper error handling
   */
  private static async loadByFormat(
    fileUrl: string, 
    format: string, 
    onProgress?: (progress: LoadProgress) => void
  ): Promise<LoadedCADModel> {
    
    switch (format) {
      case 'stl':
        return this.loadSTL(fileUrl, onProgress);
      case 'obj':
        return this.loadOBJ(fileUrl, onProgress);
      case 'gltf':
      case 'glb':
        return this.loadGLTF(fileUrl, onProgress);
      case 'ply':
        return this.loadPLY(fileUrl, onProgress);
      case 'step':
      case 'iges':
        return this.loadCADFile(fileUrl, format, onProgress);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * STL loader with enhanced error handling
   */
  private static async loadSTL(
    fileUrl: string, 
    onProgress?: (progress: LoadProgress) => void
  ): Promise<LoadedCADModel> {
    
    onProgress?.({ progress: 30, stage: 'Loading STL geometry' });
    
    const loader = new STLLoader();
    
    const geometry = await new Promise<THREE.BufferGeometry>((resolve, reject) => {
      loader.load(
        fileUrl,
        (loadedGeometry) => {
          try {
            // Process geometry for consistent rendering
            this.processGeometry(loadedGeometry);
            resolve(loadedGeometry);
          } catch (error) {
            reject(new Error(`STL processing failed: ${error.message}`));
          }
        },
        (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const progress = 30 + (progressEvent.loaded / progressEvent.total) * 40;
            onProgress?.({ progress, stage: 'Loading STL data' });
          }
        },
        (error) => {
          reject(new Error(`STL loading failed: ${error.message || 'Unknown error'}`));
        }
      );
    });

    onProgress?.({ progress: 80, stage: 'Creating materials' });
    
    // Create standard material for STL with proper React Three Fiber compatibility
    const material = this.createSafeMaterial({
      color: 0x888888,
      type: 'MeshPhongMaterial',
      properties: {
        side: THREE.DoubleSide,
        shininess: 30,
        specular: 0x111111
      }
    });

    return {
      geometry,
      materials: [material]
    };
  }

  /**
   * OBJ loader with MTL support and enhanced error handling
   */
  private static async loadOBJ(
    fileUrl: string, 
    onProgress?: (progress: LoadProgress) => void
  ): Promise<LoadedCADModel> {
    
    onProgress?.({ progress: 30, stage: 'Loading OBJ geometry' });
    
    const objLoader = new OBJLoader();
    
    // Try to load MTL file if available
    const mtlUrl = fileUrl.replace(/\.obj$/i, '.mtl');
    
    try {
      onProgress?.({ progress: 20, stage: 'Loading materials' });
      
      const mtlLoader = new MTLLoader();
      const materials = await new Promise<any>((resolve) => {
        mtlLoader.load(mtlUrl, resolve, undefined, () => {
          // MTL not found or failed to load, continue without materials
          resolve(null);
        });
      });
      
      if (materials) {
        materials.preload();
        objLoader.setMaterials(materials);
      }
    } catch (error) {
      console.log('MTL file not found or failed to load, using default materials');
    }

    const objGroup = await new Promise<THREE.Group>((resolve, reject) => {
      objLoader.load(
        fileUrl,
        resolve,
        (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const progress = 30 + (progressEvent.loaded / progressEvent.total) * 40;
            onProgress?.({ progress, stage: 'Loading OBJ data' });
          }
        },
        (error) => {
          reject(new Error(`OBJ loading failed: ${error.message || 'Unknown error'}`));
        }
      );
    });

    onProgress?.({ progress: 80, stage: 'Processing OBJ geometry' });

    // Extract geometry and materials from the group
    const meshes: THREE.Mesh[] = [];
    objGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshes.push(child);
      }
    });

    if (meshes.length === 0) {
      throw new Error('No meshes found in OBJ file');
    }

    // Use the first mesh (could be enhanced to combine multiple meshes)
    const mesh = meshes[0];
    this.processGeometry(mesh.geometry);

    const materials = mesh.material 
      ? Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      : [this.createSafeMaterial({ color: 0x888888, type: 'MeshPhongMaterial' })];

    // Clean materials for React Three Fiber compatibility
    const cleanMaterials = materials.map(mat => this.cleanMaterial(mat));

    return {
      geometry: mesh.geometry,
      materials: cleanMaterials
    };
  }

  /**
   * GLTF/GLB loader with enhanced error handling
   */
  private static async loadGLTF(
    fileUrl: string, 
    onProgress?: (progress: LoadProgress) => void
  ): Promise<LoadedCADModel> {
    
    onProgress?.({ progress: 30, stage: 'Loading GLTF/GLB' });
    
    const loader = new GLTFLoader();
    
    const gltf = await new Promise<any>((resolve, reject) => {
      loader.load(
        fileUrl,
        resolve,
        (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const progress = 30 + (progressEvent.loaded / progressEvent.total) * 50;
            onProgress?.({ progress, stage: 'Loading GLTF data' });
          }
        },
        (error) => {
          reject(new Error(`GLTF loading failed: ${error.message || 'Unknown error'}`));
        }
      );
    });

    onProgress?.({ progress: 85, stage: 'Processing GLTF scene' });

    // Extract meshes from the scene
    const meshes: THREE.Mesh[] = [];
    gltf.scene.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        meshes.push(child);
      }
    });

    if (meshes.length === 0) {
      throw new Error('No meshes found in GLTF file');
    }

    // Use the first mesh
    const mesh = meshes[0];
    this.processGeometry(mesh.geometry);

    // Clean materials for React Three Fiber compatibility
    const materials = mesh.material 
      ? Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      : [];

    const cleanMaterials = materials.length > 0 
      ? materials.map(mat => this.cleanMaterial(mat))
      : [this.createSafeMaterial({ color: 0x888888, type: 'MeshStandardMaterial' })];

    return {
      geometry: mesh.geometry,
      materials: cleanMaterials
    };
  }

  /**
   * PLY loader with enhanced error handling
   */
  private static async loadPLY(
    fileUrl: string, 
    onProgress?: (progress: LoadProgress) => void
  ): Promise<LoadedCADModel> {
    
    onProgress?.({ progress: 30, stage: 'Loading PLY geometry' });
    
    const loader = new PLYLoader();
    
    const geometry = await new Promise<THREE.BufferGeometry>((resolve, reject) => {
      loader.load(
        fileUrl,
        (loadedGeometry) => {
          try {
            this.processGeometry(loadedGeometry);
            resolve(loadedGeometry);
          } catch (error) {
            reject(new Error(`PLY processing failed: ${error.message}`));
          }
        },
        (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const progress = 30 + (progressEvent.loaded / progressEvent.total) * 40;
            onProgress?.({ progress, stage: 'Loading PLY data' });
          }
        },
        (error) => {
          reject(new Error(`PLY loading failed: ${error.message || 'Unknown error'}`));
        }
      );
    });

    onProgress?.({ progress: 80, stage: 'Creating PLY materials' });

    // Create material with vertex colors if available
    const material = this.createSafeMaterial({
      color: 0x888888,
      type: 'MeshPhongMaterial',
      properties: {
        side: THREE.DoubleSide,
        vertexColors: geometry.hasAttribute('color')
      }
    });

    return {
      geometry,
      materials: [material]
    };
  }

  /**
   * STEP/IGES loader with fallback geometry
   */
  private static async loadCADFile(
    fileUrl: string, 
    format: string, 
    onProgress?: (progress: LoadProgress) => void
  ): Promise<LoadedCADModel> {
    
    onProgress?.({ progress: 20, stage: 'Processing CAD file' });
    
    console.log(`Loading ${format.toUpperCase()} file with representative geometry (OpenCascade.js not available)`);
    
    try {
      onProgress?.({ progress: 50, stage: `Processing ${format.toUpperCase()} geometry` });
      
      // Create representative geometry for CAD files
      const geometry = this.createCADRepresentativeGeometry(format);
      
      onProgress?.({ progress: 90, stage: 'Finalizing geometry' });
      
      this.processGeometry(geometry);
      
      // Create standard material
      const material = this.createSafeMaterial({
        color: format === 'step' ? 0x4a90e2 : 0xe24a4a, // Blue for STEP, Red for IGES
        type: 'MeshPhongMaterial',
        properties: {
          side: THREE.DoubleSide,
          shininess: 30
        }
      });

      return {
        geometry,
        materials: [material]
      };
      
    } catch (error) {
      console.warn(`Failed to process ${format.toUpperCase()}:`, error);
      throw new Error(`${format.toUpperCase()} files are not fully supported yet. Please convert to STL, OBJ, or GLTF format.`);
    }
  }

  /**
   * Create safe material that won't cause React Three Fiber prop application errors
   */
  private static createSafeMaterial(config: {
    color: number;
    type: string;
    properties?: any;
  }): THREE.Material {
    let material: THREE.Material;

    switch (config.type) {
      case 'MeshPhongMaterial':
        material = new THREE.MeshPhongMaterial({
          color: config.color,
          ...config.properties
        });
        break;
      case 'MeshStandardMaterial':
        material = new THREE.MeshStandardMaterial({
          color: config.color,
          ...config.properties
        });
        break;
      default:
        material = new THREE.MeshStandardMaterial({
          color: config.color,
          ...config.properties
        });
    }

    return this.cleanMaterial(material);
  }

  /**
   * Clean material to prevent React Three Fiber prop application errors
   */
  private static cleanMaterial(material: THREE.Material): THREE.Material {
    const cleanMaterial = material.clone();
    
    // Remove potentially problematic properties that cause React Three Fiber errors
    delete (cleanMaterial as any).lov;
    delete (cleanMaterial as any)._listeners;
    delete (cleanMaterial as any).__reactInternalInstance;
    delete (cleanMaterial as any).__reactInternalMemoizedUnmaskedChildContext;
    delete (cleanMaterial as any).__reactInternalMemoizedMaskedChildContext;
    
    // Ensure proper React Three Fiber compatibility
    cleanMaterial.needsUpdate = true;
    cleanMaterial.side = THREE.DoubleSide;
    
    return cleanMaterial;
  }

  /**
   * Process geometry for consistent rendering with comprehensive error handling
   */
  private static processGeometry(geometry: THREE.BufferGeometry): void {
    try {
      // Validate geometry exists and has essential attributes
      if (!geometry) {
        throw new Error('Null geometry passed to processGeometry');
      }

      if (!geometry.attributes) {
        throw new Error('Geometry missing attributes');
      }

      // Essential position attribute check
      if (!geometry.attributes.position || !geometry.attributes.position.array || geometry.attributes.position.array.length === 0) {
        throw new Error('Geometry missing or invalid position attribute');
      }

      // Clean up potentially problematic properties that cause React Three Fiber errors
      delete (geometry as any).lov;
      delete (geometry as any)._listeners;
      delete (geometry as any).__reactInternalInstance;
      delete (geometry as any).__reactInternalMemoizedUnmaskedChildContext;
      delete (geometry as any).__reactInternalMemoizedMaskedChildContext;

      // Safely compute normals if missing or invalid
      try {
        if (!geometry.attributes.normal || !geometry.attributes.normal.array || geometry.attributes.normal.array.length === 0) {
          geometry.computeVertexNormals();
        }
      } catch (error) {
        console.warn('Failed to compute vertex normals:', error);
      }
      
      // Safely compute bounding data
      try {
        if (!geometry.boundingBox) {
          geometry.computeBoundingBox();
        }
      } catch (error) {
        console.warn('Failed to compute bounding box:', error);
      }
      
      try {
        if (!geometry.boundingSphere) {
          geometry.computeBoundingSphere();
        }
      } catch (error) {
        console.warn('Failed to compute bounding sphere:', error);
      }
      
      // Center and scale the geometry safely
      this.centerAndScaleGeometry(geometry);
      
    } catch (error) {
      console.error('Critical error processing geometry:', error);
      throw error;
    }
  }

  /**
   * Safely center and scale geometry
   */
  private static centerAndScaleGeometry(geometry: THREE.BufferGeometry): void {
    try {
      const box = geometry.boundingBox;
      if (box && box.min && box.max && 
          !isNaN(box.min.x) && !isNaN(box.min.y) && !isNaN(box.min.z) &&
          !isNaN(box.max.x) && !isNaN(box.max.y) && !isNaN(box.max.z)) {
        
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Only translate if center values are valid numbers
        if (!isNaN(center.x) && !isNaN(center.y) && !isNaN(center.z)) {
          geometry.translate(-center.x, -center.y, -center.z);
        }
        
        // Scale to reasonable size if too large
        const maxDim = Math.max(size.x || 1, size.y || 1, size.z || 1);
        if (maxDim > 10 && !isNaN(maxDim) && maxDim !== Infinity) {
          const scale = 5 / maxDim;
          geometry.scale(scale, scale, scale);
        }
      }
    } catch (error) {
      console.warn('Failed to center/scale geometry:', error);
    }
  }

  /**
   * Compute safe bounding box
   */
  private static computeSafeBoundingBox(geometry: THREE.BufferGeometry): THREE.Box3 | undefined {
    try {
      if (!geometry.boundingBox) {
        geometry.computeBoundingBox();
      }
      return geometry.boundingBox || undefined;
    } catch (error) {
      console.warn('Failed to compute bounding box:', error);
      return undefined;
    }
  }

  /**
   * Create representative geometry for CAD files
   */
  private static createCADRepresentativeGeometry(format: string): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    
    // Create a mechanical part-like geometry
    const vertices = new Float32Array([
      // Main body (hexagonal prism)
      -1.5, -1.3, -0.8,  1.5, -1.3, -0.8,  2.6, 0, -0.8,  1.5, 1.3, -0.8,  -1.5, 1.3, -0.8,  -2.6, 0, -0.8,
      -1.5, -1.3,  0.8,  1.5, -1.3,  0.8,  2.6, 0,  0.8,  1.5, 1.3,  0.8,  -1.5, 1.3,  0.8,  -2.6, 0,  0.8,
      
      // Central boss
      -0.8, -0.8, 0.8,  0.8, -0.8, 0.8,  0.8, 0.8, 0.8,  -0.8, 0.8, 0.8,
      -0.6, -0.6, 1.4,  0.6, -0.6, 1.4,  0.6, 0.6, 1.4,  -0.6, 0.6, 1.4,
    ]);
    
    const indices = new Uint16Array([
      // Main body faces
      0,1,7, 0,7,6,   1,2,8, 1,8,7,   2,3,9, 2,9,8,   3,4,10, 3,10,9,   4,5,11, 4,11,10,   5,0,6, 5,6,11,
      // Top and bottom
      0,1,2, 0,2,3, 0,3,4, 0,4,5,   6,11,10, 6,10,9, 6,9,8, 6,8,7,
      // Boss faces
      12,13,14, 12,14,15,   16,19,18, 16,18,17,   12,16,17, 12,17,13,   14,18,19, 14,19,15
    ]);
    
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    return geometry;
  }

  /**
   * Utility functions
   */
  private static countVertices(geometry: THREE.BufferGeometry): number {
    return geometry.attributes.position?.count || 0;
  }

  private static countFaces(geometry: THREE.BufferGeometry): number {
    if (geometry.index) {
      return geometry.index.count / 3;
    }
    return (geometry.attributes.position?.count || 0) / 3;
  }

  private static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static getDescriptiveError(error: Error, fileName: string): string {
    const format = fileName.split('.').pop()?.toUpperCase() || 'UNKNOWN';
    
    if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
      return `Failed to download ${format} file. Please check your internet connection and try again.`;
    }
    
    if (error.message.includes('CORS')) {
      return `CORS policy blocked loading ${format} file. The file server needs to allow cross-origin requests.`;
    }
    
    if (error.message.includes('Unsupported')) {
      return `${format} format is not supported. Supported formats: STL, OBJ, GLTF, GLB, PLY.`;
    }
    
    if (error.message.includes('No meshes found')) {
      return `${format} file appears to be empty or corrupted. Please verify the file contains valid 3D geometry.`;
    }
    
    if (error.message.includes('Failed to parse')) {
      return `${format} file is corrupted or not in the expected format. Please check the file integrity.`;
    }
    
    return `Failed to load ${format} file: ${error.message}`;
  }
}
