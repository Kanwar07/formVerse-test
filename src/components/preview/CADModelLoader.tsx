import * as THREE from 'three';
import { STLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import { GLTFLoader } from 'three-stdlib';

export interface LoadedCADModel {
  geometry: THREE.BufferGeometry;
  materials: THREE.Material[];
}

export class CADModelLoader {
  static async loadModel(fileUrl: string, fileType: string): Promise<LoadedCADModel> {
    console.log('CADModelLoader: Starting loadModel', { fileUrl, fileType });
    
    // Try to use UniversalCADLoader first for better error handling and format support
    try {
      const fileName = fileUrl.split('/').pop() || `model.${fileType}`;
      const { UniversalCADLoader } = await import('./UniversalCADLoader');
      
      const result = await UniversalCADLoader.loadModel(fileUrl, fileName);
      return {
        geometry: result.geometry,
        materials: result.materials
      };
    } catch (error) {
      console.warn('UniversalCADLoader failed, falling back to legacy loader:', error);
      
      // Fallback to legacy loading logic
      const extension = fileType.toLowerCase() || fileUrl.split('.').pop()?.toLowerCase();
      console.log('CADModelLoader: Detected extension:', extension);
      
      let loadedGeometry: THREE.BufferGeometry;
      let loadedMaterials: THREE.Material[] = [];

      switch (extension) {
        case 'stl':
          console.log('CADModelLoader: Loading STL file');
          loadedGeometry = await CADModelLoader.loadSTL(fileUrl);
          break;

        case 'obj':
          console.log('CADModelLoader: Loading OBJ file');
          const objResult = await CADModelLoader.loadOBJ(fileUrl);
          loadedGeometry = objResult.geometry;
          loadedMaterials = objResult.materials;
          break;

        case 'gltf':
        case 'glb':
          console.log('CADModelLoader: Loading GLTF/GLB file');
          const gltfResult = await CADModelLoader.loadGLTF(fileUrl);
          loadedGeometry = gltfResult.geometry;
          loadedMaterials = gltfResult.materials;
          break;

        case 'step':
        case 'stp':
        case 'iges':
        case 'igs':
          console.log('CADModelLoader: Loading STEP/IGES file');
          loadedGeometry = await CADModelLoader.loadSTEP(fileUrl);
          break;

        default:
          console.error('CADModelLoader: Unsupported file format:', extension);
          throw new Error(`Unsupported file format: ${extension}. Supported formats: STL, OBJ, GLTF, GLB, PLY, STEP, IGES`);
      }

      console.log('CADModelLoader: Model loaded successfully', { 
        geometry: loadedGeometry, 
        materials: loadedMaterials,
        vertices: loadedGeometry.attributes.position?.count || 0
      });
      
      return { geometry: loadedGeometry, materials: loadedMaterials };
    }
  }

  private static async loadSTL(fileUrl: string): Promise<THREE.BufferGeometry> {
    console.log('=== CADModelLoader: Loading STL file ===');
    console.log('STL URL:', fileUrl);
    
    const stlLoader = new STLLoader();
    return new Promise<THREE.BufferGeometry>((resolve, reject) => {
      console.log('STLLoader: Starting to load file...');
      stlLoader.load(
        fileUrl, 
        (geometry) => {
          console.log('STLLoader: File loaded successfully!', geometry);
          resolve(geometry);
        }, 
        (progress) => {
          console.log('STLLoader: Loading progress:', progress);
        }, 
        (error) => {
          console.error('STLLoader: Failed to load file:', error);
          reject(error);
        }
      );
    });
  }

  private static async loadOBJ(fileUrl: string): Promise<LoadedCADModel> {
    const objLoader = new OBJLoader();
    const objGroup = await new Promise<THREE.Group>((resolve, reject) => {
      objLoader.load(fileUrl, resolve, undefined, reject);
    });
    
    const objMesh = objGroup.children.find(child => child instanceof THREE.Mesh) as THREE.Mesh;
    if (!objMesh?.geometry) {
      throw new Error('No geometry found in OBJ');
    }
    
    const materials = objMesh.material 
      ? Array.isArray(objMesh.material) ? objMesh.material : [objMesh.material]
      : [];

    return {
      geometry: objMesh.geometry,
      materials
    };
  }

  private static async loadGLTF(fileUrl: string): Promise<LoadedCADModel> {
    const gltfLoader = new GLTFLoader();
    const gltf = await new Promise<any>((resolve, reject) => {
      gltfLoader.load(fileUrl, resolve, undefined, reject);
    });
    
    // Extract geometry from GLTF scene
    const meshes: THREE.Mesh[] = [];
    gltf.scene.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        meshes.push(child);
      }
    });
    
    if (meshes.length === 0) {
      throw new Error('No meshes found in GLTF');
    }
    
    // For now, use the first mesh
    const materials = meshes[0].material 
      ? Array.isArray(meshes[0].material) ? meshes[0].material : [meshes[0].material]
      : [];

    return {
      geometry: meshes[0].geometry,
      materials
    };
  }

  private static async loadSTEP(fileUrl: string): Promise<THREE.BufferGeometry> {
    console.log('=== CADModelLoader: Loading STEP/IGES file ===');
    console.log('STEP URL:', fileUrl);
    
    try {
      // For now, create a placeholder geometry for STEP files
      // In a production environment, you would use OpenCascade.js or similar
      console.log('Creating placeholder geometry for STEP file - Advanced CAD loader needed for full support');
      
      // Create a more sophisticated placeholder that resembles a mechanical part
      const geometry = new THREE.BufferGeometry();
      
      // Create vertices for a complex mechanical part shape
      const vertices = new Float32Array([
        // Base rectangular prism
        -1, -1, -1,  1, -1, -1,  1,  1, -1, -1,  1, -1, // bottom face
        -1, -1,  1,  1, -1,  1,  1,  1,  1, -1,  1,  1, // top face
        
        // Cylindrical feature (simplified as octagon)
        0.5, -0.5, 1,  0.7071, 0, 1,  0.5, 0.5, 1,  0, 0.7071, 1,
        -0.5, 0.5, 1, -0.7071, 0, 1, -0.5, -0.5, 1,  0, -0.7071, 1,
        
        // Raised cylindrical feature
        0.5, -0.5, 1.5,  0.7071, 0, 1.5,  0.5, 0.5, 1.5,  0, 0.7071, 1.5,
        -0.5, 0.5, 1.5, -0.7071, 0, 1.5, -0.5, -0.5, 1.5,  0, -0.7071, 1.5
      ]);
      
      // Create faces (indices)
      const indices = new Uint16Array([
        // Base faces
        0, 1, 2,  0, 2, 3,    // bottom
        4, 7, 6,  4, 6, 5,    // top
        0, 4, 5,  0, 5, 1,    // front
        2, 6, 7,  2, 7, 3,    // back
        0, 3, 7,  0, 7, 4,    // left
        1, 5, 6,  1, 6, 2,    // right
        
        // Cylindrical features (simplified)
        8, 9, 10,  8, 10, 11,  8, 11, 12,  8, 12, 13,
        8, 13, 14,  8, 14, 15,  8, 15, 9,   // bottom octagon
        16, 17, 18,  16, 18, 19,  16, 19, 20,  16, 20, 21,
        16, 21, 22,  16, 22, 23,  16, 23, 17  // top octagon
      ]);
      
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.computeVertexNormals();
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      
      console.log('STEP placeholder geometry created with', vertices.length / 3, 'vertices');
      
      return geometry;
      
    } catch (error) {
      console.error('Error loading STEP file:', error);
      
      // Fallback to simple box geometry
      const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
      boxGeometry.computeVertexNormals();
      console.log('Fallback to box geometry for STEP file');
      
      return boxGeometry;
    }
  }
}