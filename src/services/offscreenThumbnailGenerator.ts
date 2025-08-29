import * as THREE from 'three';
import { STLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import { GLTFLoader } from 'three-stdlib';
import { supabase } from '@/integrations/supabase/client';

export interface ThumbnailOptions {
  width?: number;
  height?: number;
  cameraDistance?: number;
  backgroundColor?: string;
  lightIntensity?: number;
  quality?: number;
  format?: 'png' | 'jpeg';
  angles?: Array<{ x: number; y: number; z: number }>;
}

export interface ThumbnailResult {
  success: boolean;
  thumbnailUrl?: string;
  error?: string;
  metadata?: {
    vertices: number;
    faces: number;
    boundingBox: {
      width: number;
      height: number;
      depth: number;
    };
  };
}

export class OffscreenThumbnailGenerator {
  private static renderer: THREE.WebGLRenderer | null = null;

  static async generateThumbnail(
    fileUrl: string,
    fileName: string,
    fileType: string,
    userId: string,
    options: ThumbnailOptions = {}
  ): Promise<ThumbnailResult> {
    const {
      width = 512,
      height = 512,
      cameraDistance = 3,
      backgroundColor = '#f8fafc',
      lightIntensity = 1,
      quality = 0.9,
      format = 'png',
      angles = [{ x: 0.3, y: 0.5, z: 0 }] // Default single angle
    } = options;

    try {
      console.log('=== OFFSCREEN THUMBNAIL GENERATION START ===');
      console.log('File URL:', fileUrl);
      console.log('Options:', options);

      // Load the 3D model
      const { geometry, materials } = await this.loadModel(fileUrl, fileType);
      
      // Calculate model metadata
      const metadata = this.calculateModelMetadata(geometry);
      console.log('Model metadata:', metadata);

      // Generate thumbnail for the primary angle
      const thumbnailBlob = await this.renderModelToBlob(
        geometry,
        materials,
        angles[0],
        { width, height, cameraDistance, backgroundColor, lightIntensity, quality, format }
      );

      if (!thumbnailBlob) {
        throw new Error('Failed to generate thumbnail blob');
      }

      // Upload thumbnail to storage
      const uploadResult = await this.uploadThumbnailBlob(thumbnailBlob, fileName, userId);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      console.log('Thumbnail generated successfully:', uploadResult.thumbnailUrl);

      return {
        success: true,
        thumbnailUrl: uploadResult.thumbnailUrl,
        metadata
      };

    } catch (error) {
      console.error('Thumbnail generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private static async loadModel(fileUrl: string, fileType: string): Promise<{
    geometry: THREE.BufferGeometry;
    materials: THREE.Material[];
  }> {
    // Check if this is a Modal URL that needs proxy
    const isModalUrl = fileUrl.includes('formversedude--cadqua-3d-api-fastapi-app.modal.run/download/');
    let actualUrl = fileUrl;
    
    if (isModalUrl) {
      console.log('Modal URL detected, using proxy for CORS-safe loading...');
      try {
        // Extract task_id from Modal URL
        const urlParts = fileUrl.split('/');
        const taskId = urlParts[urlParts.length - 1];
        const fileTypeFromUrl = urlParts[urlParts.length - 2]; // 'glb' or 'video'
        
        // Use the Edge Function proxy to get the file
        const { getGlbBlobUrl } = await import('@/utils/cadqua');
        actualUrl = await getGlbBlobUrl(taskId, 'https://formversedude--cadqua-3d-api-fastapi-app.modal.run');
        console.log('Got blob URL for Modal file:', actualUrl);
      } catch (error) {
        console.error('Failed to get blob URL for Modal file:', error);
        throw new Error(`Failed to load Modal file: ${error}`);
      }
    }

    return new Promise((resolve, reject) => {
      // Enhanced file type detection
      let extension = '';
      
      // First try to detect from MIME type
      if (fileType) {
        if (fileType.includes('stl') || fileType === 'application/sla') {
          extension = 'stl';
        } else if (fileType.includes('obj')) {
          extension = 'obj';
        } else if (fileType.includes('gltf') || fileType === 'model/gltf+json') {
          extension = 'gltf';
        } else if (fileType.includes('glb') || fileType === 'model/gltf-binary') {
          extension = 'glb';
        } else if (fileType.includes('ply')) {
          extension = 'ply';
        }
      }
      
      // Fallback to original file URL extension if MIME type detection failed
      if (!extension) {
        extension = fileUrl.split('.').pop()?.toLowerCase() || '';
      }
      
      console.log('Loading model with extension:', extension);

      switch (extension) {
        case 'stl':
          this.loadSTL(actualUrl, resolve, reject);
          break;
        case 'obj':
          this.loadOBJ(actualUrl, resolve, reject);
          break;
        case 'gltf':
        case 'glb':
          this.loadGLTF(actualUrl, resolve, reject);
          break;
        default:
          // Default to STL for unknown formats
          console.warn('Unknown format, attempting STL loader:', extension);
          this.loadSTL(actualUrl, resolve, reject);
      }
    });
  }

  private static loadSTL(
    fileUrl: string,
    resolve: (result: { geometry: THREE.BufferGeometry; materials: THREE.Material[] }) => void,
    reject: (error: Error) => void
  ) {
    const loader = new STLLoader();
    loader.load(
      fileUrl,
      (geometry) => {
        geometry.computeVertexNormals();
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        
        const material = new THREE.MeshPhongMaterial({
          color: 0x6366f1,
          shininess: 100,
          specular: 0x111111
        });
        
        resolve({ geometry, materials: [material] });
      },
      undefined,
      (error) => reject(new Error(`STL loading failed: ${error.message}`))
    );
  }

  private static loadOBJ(
    fileUrl: string,
    resolve: (result: { geometry: THREE.BufferGeometry; materials: THREE.Material[] }) => void,
    reject: (error: Error) => void
  ) {
    const loader = new OBJLoader();
    loader.load(
      fileUrl,
      (object) => {
        const mesh = object.children.find(child => child instanceof THREE.Mesh) as THREE.Mesh;
        if (!mesh?.geometry) {
          reject(new Error('No geometry found in OBJ'));
          return;
        }
        
        mesh.geometry.computeVertexNormals();
        mesh.geometry.computeBoundingBox();
        mesh.geometry.computeBoundingSphere();
        
        const materials = mesh.material 
          ? Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          : [new THREE.MeshPhongMaterial({ color: 0x10b981 })];
        
        resolve({ geometry: mesh.geometry, materials });
      },
      undefined,
      (error) => reject(new Error(`OBJ loading failed: ${error.message}`))
    );
  }

  private static loadGLTF(
    fileUrl: string,
    resolve: (result: { geometry: THREE.BufferGeometry; materials: THREE.Material[] }) => void,
    reject: (error: Error) => void
  ) {
    const loader = new GLTFLoader();
    loader.load(
      fileUrl,
      (gltf) => {
        const meshes: THREE.Mesh[] = [];
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            meshes.push(child);
          }
        });
        
        if (meshes.length === 0) {
          reject(new Error('No meshes found in GLTF'));
          return;
        }
        
        // Use the first mesh for thumbnail
        const mesh = meshes[0];
        mesh.geometry.computeVertexNormals();
        mesh.geometry.computeBoundingBox();
        mesh.geometry.computeBoundingSphere();
        
        const materials = mesh.material 
          ? Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          : [new THREE.MeshPhongMaterial({ color: 0xf59e0b })];
        
        resolve({ geometry: mesh.geometry, materials });
      },
      undefined,
      (error) => reject(new Error(`GLTF loading failed: ${error.message}`))
    );
  }

  private static calculateModelMetadata(geometry: THREE.BufferGeometry) {
    const vertices = geometry.attributes.position?.count || 0;
    const faces = geometry.index ? geometry.index.count / 3 : vertices / 3;
    
    geometry.computeBoundingBox();
    const boundingBox = geometry.boundingBox!;
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    
    return {
      vertices,
      faces: Math.floor(faces),
      boundingBox: {
        width: Number(size.x.toFixed(3)),
        height: Number(size.y.toFixed(3)),
        depth: Number(size.z.toFixed(3))
      }
    };
  }

  private static async renderModelToBlob(
    geometry: THREE.BufferGeometry,
    materials: THREE.Material[],
    angle: { x: number; y: number; z: number },
    options: {
      width: number;
      height: number;
      cameraDistance: number;
      backgroundColor: string;
      lightIntensity: number;
      quality: number;
      format: 'png' | 'jpeg';
    }
  ): Promise<Blob | null> {
    const { width, height, cameraDistance, backgroundColor, lightIntensity, quality, format } = options;

    // Create or reuse renderer
    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true
      });
    }
    
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(1); // Use 1 for consistent output
    this.renderer.setClearColor(backgroundColor, 1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);

    // Setup lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4 * lightIntensity);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8 * lightIntensity);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3 * lightIntensity);
    fillLight.position.set(-5, -2, -5);
    scene.add(fillLight);

    // Create mesh
    const material = materials[0] || new THREE.MeshPhongMaterial({ color: 0x6366f1 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    
    // Center and scale the model
    geometry.computeBoundingBox();
    const boundingBox = geometry.boundingBox!;
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    
    mesh.position.sub(center);
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDimension;
    mesh.scale.setScalar(scale);
    
    scene.add(mesh);

    // Setup camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(
      cameraDistance * Math.cos(angle.y) * Math.cos(angle.x),
      cameraDistance * Math.sin(angle.x),
      cameraDistance * Math.sin(angle.y) * Math.cos(angle.x)
    );
    camera.lookAt(0, 0, 0);

    // Render the scene
    this.renderer.render(scene, camera);

    // Convert to blob
    return new Promise((resolve) => {
      const canvas = this.renderer!.domElement;
      canvas.toBlob(
        (blob) => resolve(blob),
        format === 'jpeg' ? 'image/jpeg' : 'image/png',
        quality
      );
    });
  }

  private static async uploadThumbnailBlob(
    blob: Blob,
    fileName: string,
    userId: string
  ): Promise<{ success: boolean; thumbnailUrl?: string; error?: string }> {
    try {
      const timestamp = Date.now();
      const thumbnailFileName = `thumbnail-${timestamp}-${fileName.replace(/\.[^/.]+$/, '')}.png`;
      const filePath = `${userId}/thumbnails/${thumbnailFileName}`;
      
      console.log('Uploading 3D thumbnail to:', filePath, 'Size:', blob.size);
      
      const { data, error } = await supabase.storage
        .from('3d-models')
        .upload(filePath, blob, {
          cacheControl: '31536000', // 1 year cache
          upsert: false
        });

      if (error) {
        console.error('3D thumbnail upload error:', error);
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('3d-models')
        .getPublicUrl(data.path);

      console.log('3D thumbnail uploaded successfully:', urlData.publicUrl);
      
      return {
        success: true,
        thumbnailUrl: urlData.publicUrl
      };
    } catch (error) {
      console.error('3D thumbnail upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  // Cleanup method to dispose of the renderer when no longer needed
  static dispose() {
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
  }
}