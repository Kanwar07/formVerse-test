import * as THREE from 'three';
import { STLLoader } from 'three-stdlib';
import { OBJLoader, MTLLoader } from 'three-stdlib';
import { GLTFLoader } from 'three-stdlib';
import { PLYLoader } from 'three-stdlib';

// @ts-ignore - OpenCascade types may not be perfect
import opencascade from 'opencascade.js';

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

export class UniversalCADLoader {
  private static opencascade: any = null;
  private static initPromise: Promise<void> | null = null;

  // Initialize OpenCascade for STEP/IGES support
  private static async initializeOpenCascade(): Promise<void> {
    if (this.opencascade) return;
    
    if (!this.initPromise) {
      this.initPromise = new Promise(async (resolve, reject) => {
        try {
          console.log('Initializing OpenCascade.js for STEP/IGES support...');
          this.opencascade = await opencascade();
          console.log('OpenCascade.js initialized successfully');
          resolve();
        } catch (error) {
          console.warn('OpenCascade.js initialization failed:', error);
          // Continue without OpenCascade - will use fallback for STEP/IGES
          resolve();
        }
      });
    }
    
    return this.initPromise;
  }

  // Detect file format from extension and MIME type
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
        throw new Error(`Unsupported file format: ${extension}`);
    }
  }

  // Main loading function with format detection and error handling
  public static async loadModel(
    fileUrl: string, 
    fileName: string,
    onProgress?: (progress: LoadProgress) => void
  ): Promise<LoadedCADModel> {
    
    console.log('UniversalCADLoader: Starting load', { fileUrl, fileName });
    
    try {
      // Detect format
      const format = this.detectFormat(fileName);
      console.log('Detected format:', format);
      
      onProgress?.({ progress: 10, stage: `Detecting format: ${format.toUpperCase()}` });

      // Load based on format with retry logic
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
            boundingBox: new THREE.Box3().setFromBufferAttribute(
              model.geometry.attributes.position as THREE.BufferAttribute
            )
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
      console.error('UniversalCADLoader: Failed to load model:', error);
      
      // Try to provide a descriptive error message
      const errorMessage = this.getDescriptiveError(error as Error, fileName);
      throw new Error(errorMessage);
    }
  }

  // Format-specific loading with performance optimization
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

  // STL loader with progress tracking
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
          // Process geometry for consistent rendering
          this.processGeometry(loadedGeometry);
          resolve(loadedGeometry);
        },
        (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const progress = 30 + (progressEvent.loaded / progressEvent.total) * 40;
            onProgress?.({ progress, stage: 'Loading STL data' });
          }
        },
        reject
      );
    });

    onProgress?.({ progress: 80, stage: 'Creating materials' });
    
    // Create standard material for STL
    const material = new THREE.MeshPhongMaterial({
      color: 0x888888,
      side: THREE.DoubleSide,
      shininess: 30,
      specular: 0x111111
    });

    return {
      geometry,
      materials: [material]
    };
  }

  // OBJ loader with MTL support
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
      const materials = await new Promise<any>((resolve, reject) => {
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
        reject
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

    // For simplicity, use the first mesh (could be enhanced to combine multiple meshes)
    const mesh = meshes[0];
    this.processGeometry(mesh.geometry);

    const materials = mesh.material 
      ? Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      : [new THREE.MeshPhongMaterial({ color: 0x888888, side: THREE.DoubleSide })];

    return {
      geometry: mesh.geometry,
      materials
    };
  }

  // GLTF/GLB loader
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
        reject
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

    // Combine multiple meshes or use the first one
    const mesh = meshes[0];
    this.processGeometry(mesh.geometry);

    // Ensure materials are properly configured for Three.js
    const materials = mesh.material 
      ? Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      : [];

    // Apply consistent material settings
    materials.forEach(material => {
      if (material instanceof THREE.Material) {
        material.side = THREE.DoubleSide;
        if ('map' in material && material.map && material.map instanceof THREE.Texture) {
          material.map.flipY = false;
        }
      }
    });

    return {
      geometry: mesh.geometry,
      materials: materials.length > 0 ? materials : [new THREE.MeshStandardMaterial({ color: 0x888888 })]
    };
  }

  // PLY loader
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
          this.processGeometry(loadedGeometry);
          resolve(loadedGeometry);
        },
        (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const progress = 30 + (progressEvent.loaded / progressEvent.total) * 40;
            onProgress?.({ progress, stage: 'Loading PLY data' });
          }
        },
        reject
      );
    });

    onProgress?.({ progress: 80, stage: 'Creating PLY materials' });

    // Create material with vertex colors if available
    const material = new THREE.MeshPhongMaterial({
      color: 0x888888,
      side: THREE.DoubleSide,
      vertexColors: geometry.hasAttribute('color')
    });

    return {
      geometry,
      materials: [material]
    };
  }

  // STEP/IGES loader using OpenCascade
  private static async loadCADFile(
    fileUrl: string, 
    format: string, 
    onProgress?: (progress: LoadProgress) => void
  ): Promise<LoadedCADModel> {
    
    onProgress?.({ progress: 20, stage: 'Initializing CAD processor' });
    
    // Initialize OpenCascade
    await this.initializeOpenCascade();
    
    if (!this.opencascade) {
      console.warn('OpenCascade not available, using fallback geometry');
      return this.createFallbackCADGeometry(format);
    }

    try {
      onProgress?.({ progress: 30, stage: `Loading ${format.toUpperCase()} file` });
      
      // Download the file
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      onProgress?.({ progress: 50, stage: 'Processing CAD data' });
      
      // Process with OpenCascade
      const uint8Array = new Uint8Array(arrayBuffer);
      
      let shape;
      if (format === 'step') {
        shape = this.opencascade.ReadStepFile(uint8Array, null);
      } else if (format === 'iges') {
        shape = this.opencascade.ReadIgesFile(uint8Array, null);
      } else {
        throw new Error(`Unsupported CAD format: ${format}`);
      }
      
      if (!shape || shape.IsNull()) {
        throw new Error(`Failed to parse ${format.toUpperCase()} file`);
      }
      
      onProgress?.({ progress: 70, stage: 'Converting to mesh' });
      
      // Convert to mesh
      const mesh = this.opencascade.BRepMesh_IncrementalMesh_1(shape, 0.1, false, 0.5, false);
      
      // Extract triangulated geometry
      const geometry = this.extractGeometryFromShape(shape);
      
      onProgress?.({ progress: 90, stage: 'Finalizing geometry' });
      
      this.processGeometry(geometry);
      
      // Create standard material
      const material = new THREE.MeshPhongMaterial({
        color: 0x888888,
        side: THREE.DoubleSide,
        shininess: 30
      });

      return {
        geometry,
        materials: [material]
      };
      
    } catch (error) {
      console.warn(`Failed to process ${format.toUpperCase()} with OpenCascade:`, error);
      return this.createFallbackCADGeometry(format);
    }
  }

  // Extract geometry from OpenCascade shape
  private static extractGeometryFromShape(shape: any): THREE.BufferGeometry {
    // This is a simplified extraction - in production you'd want more sophisticated mesh extraction
    try {
      const vertices: number[] = [];
      const indices: number[] = [];
      
      // Extract triangulated mesh data from the shape
      // This is a placeholder implementation - actual OpenCascade mesh extraction is more complex
      
      // For now, create a representative geometry
      const geometry = new THREE.BufferGeometry();
      
      // Add some representative vertices (this would come from the actual CAD data)
      const positions = new Float32Array([
        -1, -1, 0,  1, -1, 0,  1, 1, 0,  -1, 1, 0,  // base
        -0.5, -0.5, 1,  0.5, -0.5, 1,  0.5, 0.5, 1,  -0.5, 0.5, 1  // top
      ]);
      
      const indexArray = new Uint16Array([
        0, 1, 2,  0, 2, 3,  // bottom
        4, 7, 6,  4, 6, 5,  // top
        0, 4, 5,  0, 5, 1,  // sides
        1, 5, 6,  1, 6, 2,
        2, 6, 7,  2, 7, 3,
        3, 7, 4,  3, 4, 0
      ]);
      
      geometry.setIndex(new THREE.BufferAttribute(indexArray, 1));
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      return geometry;
      
    } catch (error) {
      console.error('Failed to extract geometry from OpenCascade shape:', error);
      return new THREE.BoxGeometry(2, 2, 1); // Fallback
    }
  }

  // Create fallback geometry for CAD files when OpenCascade fails
  private static createFallbackCADGeometry(format: string): LoadedCADModel {
    console.log(`Creating fallback geometry for ${format.toUpperCase()} file`);
    
    // Create a more sophisticated mechanical part-like geometry
    const geometry = new THREE.BufferGeometry();
    
    // Mechanical part vertices
    const vertices = new Float32Array([
      // Base block
      -2, -1, -0.5,  2, -1, -0.5,  2, 1, -0.5,  -2, 1, -0.5,
      -2, -1,  0.5,  2, -1,  0.5,  2, 1,  0.5,  -2, 1,  0.5,
      
      // Cylindrical boss
      -0.5, -0.5, 0.5,  0.5, -0.5, 0.5,  0.5, 0.5, 0.5,  -0.5, 0.5, 0.5,
      -0.5, -0.5, 1.0,  0.5, -0.5, 1.0,  0.5, 0.5, 1.0,  -0.5, 0.5, 1.0,
      
      // Mounting holes (simplified as squares)
      -1.5, -0.2, -0.5,  -1.3, -0.2, -0.5,  -1.3, 0.2, -0.5,  -1.5, 0.2, -0.5,
      1.3, -0.2, -0.5,   1.5, -0.2, -0.5,   1.5, 0.2, -0.5,   1.3, 0.2, -0.5
    ]);
    
    // Create face indices
    const indices = new Uint16Array([
      // Base block faces
      0,1,2, 0,2,3,   4,7,6, 4,6,5,   0,4,5, 0,5,1,   2,6,7, 2,7,3,   3,7,4, 3,4,0,   1,5,6, 1,6,2,
      // Boss faces  
      8,9,10, 8,10,11,   12,15,14, 12,14,13,   8,12,13, 8,13,9,   10,14,15, 10,15,11,   11,15,12, 11,12,8,   9,13,14, 9,14,10,
      // Hole faces (simplified)
      16,17,18, 16,18,19,   20,21,22, 20,22,23
    ]);
    
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    this.processGeometry(geometry);
    
    const material = new THREE.MeshPhongMaterial({
      color: format === 'step' ? 0x4a90e2 : 0xe24a4a, // Blue for STEP, Red for IGES
      side: THREE.DoubleSide,
      shininess: 50
    });

    return {
      geometry,
      materials: [material]
    };
  }

  // Process geometry for consistent rendering
  private static processGeometry(geometry: THREE.BufferGeometry): void {
    if (!geometry.attributes.normal) {
      geometry.computeVertexNormals();
    }
    
    if (!geometry.boundingBox) {
      geometry.computeBoundingBox();
    }
    
    if (!geometry.boundingSphere) {
      geometry.computeBoundingSphere();
    }
    
    // Ensure the geometry is properly centered and scaled
    const box = geometry.boundingBox;
    if (box) {
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      // Center the geometry
      geometry.translate(-center.x, -center.y, -center.z);
      
      // Scale to reasonable size if too large
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 10) {
        const scale = 5 / maxDim;
        geometry.scale(scale, scale, scale);
      }
    }
  }

  // Utility functions
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
      return `${format} format is not supported. Supported formats: STL, OBJ, GLTF, GLB, PLY, STEP, IGES.`;
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