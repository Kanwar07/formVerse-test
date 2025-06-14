
import { supabase } from "@/integrations/supabase/client";

export interface ThumbnailGenerationResult {
  success: boolean;
  thumbnailUrl?: string;
  error?: string;
}

export class ThumbnailService {
  private static readonly THUMBNAIL_API_URL = "https://api.viewstl.com/v1/thumbnail";
  
  static async generateThumbnail(
    fileUrl: string,
    fileName: string,
    fileType: string,
    userId: string
  ): Promise<ThumbnailGenerationResult> {
    try {
      console.log('Generating thumbnail for:', fileName, 'Type:', fileType);
      
      // For STL files, use ViewSTL API
      if (fileType.toLowerCase().includes('stl')) {
        return await this.generateSTLThumbnail(fileUrl, fileName, userId);
      }
      
      // For OBJ files, use a different approach
      if (fileType.toLowerCase().includes('obj')) {
        return await this.generateOBJThumbnail(fileUrl, fileName, userId);
      }
      
      // For other formats, try the generic approach
      return await this.generateGenericThumbnail(fileUrl, fileName, userId);
      
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  private static async generateSTLThumbnail(
    fileUrl: string,
    fileName: string,
    userId: string
  ): Promise<ThumbnailGenerationResult> {
    try {
      // Use ViewSTL API to generate thumbnail
      const response = await fetch(`${this.THUMBNAIL_API_URL}?url=${encodeURIComponent(fileUrl)}&width=512&height=512`);
      
      if (!response.ok) {
        throw new Error(`ViewSTL API error: ${response.status}`);
      }
      
      const blob = await response.blob();
      return await this.uploadThumbnailBlob(blob, fileName, userId);
      
    } catch (error) {
      console.error('STL thumbnail generation failed:', error);
      // Fallback to canvas-based generation
      return await this.generateCanvasThumbnail(fileUrl, fileName, userId);
    }
  }
  
  private static async generateOBJThumbnail(
    fileUrl: string,
    fileName: string,
    userId: string
  ): Promise<ThumbnailGenerationResult> {
    try {
      // For OBJ files, we'll use our canvas-based approach
      return await this.generateCanvasThumbnail(fileUrl, fileName, userId);
    } catch (error) {
      console.error('OBJ thumbnail generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate OBJ thumbnail'
      };
    }
  }
  
  private static async generateGenericThumbnail(
    fileUrl: string,
    fileName: string,
    userId: string
  ): Promise<ThumbnailGenerationResult> {
    // For other formats, try canvas-based generation
    return await this.generateCanvasThumbnail(fileUrl, fileName, userId);
  }
  
  private static async generateCanvasThumbnail(
    fileUrl: string,
    fileName: string,
    userId: string
  ): Promise<ThumbnailGenerationResult> {
    return new Promise((resolve) => {
      // Create a temporary canvas for 3D rendering
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      
      // Use Three.js to render the model
      import('three').then(async (THREE) => {
        try {
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
          const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
          
          renderer.setSize(512, 512);
          renderer.setClearColor(0xf0f0f0, 1);
          
          // Add lighting
          const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
          scene.add(ambientLight);
          
          const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
          directionalLight.position.set(10, 10, 5);
          scene.add(directionalLight);
          
          // Load the model based on file type
          let loader;
          if (fileName.toLowerCase().includes('stl')) {
            const { STLLoader } = await import('three-stdlib');
            loader = new STLLoader();
          } else if (fileName.toLowerCase().includes('obj')) {
            const { OBJLoader } = await import('three-stdlib');
            loader = new OBJLoader();
          }
          
          if (loader) {
            loader.load(
              fileUrl,
              (geometry: any) => {
                let mesh;
                if (geometry.type === 'BufferGeometry') {
                  // STL file
                  geometry.computeBoundingBox();
                  const material = new THREE.MeshLambertMaterial({ color: 0x888888 });
                  mesh = new THREE.Mesh(geometry, material);
                } else {
                  // OBJ file (group)
                  mesh = geometry;
                  mesh.traverse((child: any) => {
                    if (child.isMesh) {
                      child.material = new THREE.MeshLambertMaterial({ color: 0x888888 });
                    }
                  });
                }
                
                // Center and scale the model
                const box = new THREE.Box3().setFromObject(mesh);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                mesh.position.sub(center);
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 2 / maxDim;
                mesh.scale.multiplyScalar(scale);
                
                scene.add(mesh);
                
                // Position camera
                camera.position.set(2, 2, 3);
                camera.lookAt(0, 0, 0);
                
                // Render
                renderer.render(scene, camera);
                
                // Convert to blob and upload
                canvas.toBlob(async (blob) => {
                  if (blob) {
                    const result = await this.uploadThumbnailBlob(blob, fileName, userId);
                    resolve(result);
                  } else {
                    resolve({ success: false, error: 'Failed to create thumbnail blob' });
                  }
                }, 'image/png');
              },
              undefined,
              (error: any) => {
                console.error('Model loading error:', error);
                resolve({ success: false, error: 'Failed to load 3D model' });
              }
            );
          } else {
            resolve({ success: false, error: 'Unsupported file format' });
          }
        } catch (error) {
          console.error('Canvas thumbnail generation error:', error);
          resolve({ success: false, error: 'Canvas rendering failed' });
        }
      });
    });
  }
  
  private static async uploadThumbnailBlob(
    blob: Blob,
    fileName: string,
    userId: string
  ): Promise<ThumbnailGenerationResult> {
    try {
      const timestamp = Date.now();
      const thumbnailFileName = `thumbnail-${timestamp}-${fileName.replace(/\.[^/.]+$/, '')}.png`;
      const filePath = `${userId}/thumbnails/${thumbnailFileName}`;
      
      const { data, error } = await supabase.storage
        .from('3d-models')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('3d-models')
        .getPublicUrl(data.path);

      return {
        success: true,
        thumbnailUrl: urlData.publicUrl
      };
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }
}
