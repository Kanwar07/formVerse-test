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
    // Detect file type
    const extension = fileType.toLowerCase() || fileUrl.split('.').pop()?.toLowerCase();
    let loadedGeometry: THREE.BufferGeometry;
    let loadedMaterials: THREE.Material[] = [];

    switch (extension) {
      case 'stl':
        loadedGeometry = await CADModelLoader.loadSTL(fileUrl);
        break;

      case 'obj':
        const objResult = await CADModelLoader.loadOBJ(fileUrl);
        loadedGeometry = objResult.geometry;
        loadedMaterials = objResult.materials;
        break;

      case 'gltf':
      case 'glb':
        const gltfResult = await CADModelLoader.loadGLTF(fileUrl);
        loadedGeometry = gltfResult.geometry;
        loadedMaterials = gltfResult.materials;
        break;

      default:
        throw new Error(`Unsupported file format: ${extension}`);
    }

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