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
    
    // Detect file type
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

      default:
        console.error('CADModelLoader: Unsupported file format:', extension);
        throw new Error(`Unsupported file format: ${extension}`);
    }

    console.log('CADModelLoader: Model loaded successfully', { 
      geometry: loadedGeometry, 
      materials: loadedMaterials,
      vertices: loadedGeometry.attributes.position?.count || 0
    });
    
    return { geometry: loadedGeometry, materials: loadedMaterials };
  }

  private static async loadSTL(fileUrl: string): Promise<THREE.BufferGeometry> {
    const stlLoader = new STLLoader();
    return new Promise<THREE.BufferGeometry>((resolve, reject) => {
      stlLoader.load(fileUrl, resolve, undefined, reject);
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
}