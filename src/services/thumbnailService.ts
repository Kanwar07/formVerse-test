
import { supabase } from "@/integrations/supabase/client";

export interface ThumbnailGenerationResult {
  success: boolean;
  thumbnailUrl?: string;
  error?: string;
}

export class ThumbnailService {
  static async generateThumbnail(
    fileUrl: string,
    fileName: string,
    fileType: string,
    userId: string
  ): Promise<ThumbnailGenerationResult> {
    try {
      console.log('=== THUMBNAIL GENERATION START ===');
      console.log('File URL:', fileUrl);
      console.log('File Name:', fileName);
      console.log('File Type:', fileType);
      
      // For STL files, use ViewSTL API with better error handling
      if (fileType.toLowerCase().includes('stl') || fileName.toLowerCase().endsWith('.stl')) {
        console.log('Processing STL file with ViewSTL API');
        
        // Try multiple ViewSTL endpoints for better reliability
        const viewStlUrls = [
          `https://www.viewstl.com/?url=${encodeURIComponent(fileUrl)}`,
          `https://viewstl.com/?url=${encodeURIComponent(fileUrl)}`
        ];
        
        for (const viewStlUrl of viewStlUrls) {
          console.log('Trying ViewSTL URL:', viewStlUrl);
          
          try {
            // First, verify the file is accessible
            const fileResponse = await fetch(fileUrl, { method: 'HEAD' });
            console.log('File accessibility check:', fileResponse.status);
            
            if (!fileResponse.ok) {
              console.error('File not accessible:', fileResponse.status);
              continue;
            }
            
            // Use ViewSTL's direct image API
            const thumbnailApiUrl = `https://www.viewstl.com/api/thumbnail/400x400?url=${encodeURIComponent(fileUrl)}`;
            console.log('ViewSTL API URL:', thumbnailApiUrl);
            
            const response = await fetch(thumbnailApiUrl, {
              method: 'GET',
              headers: {
                'Accept': 'image/png, image/jpeg, */*',
                'User-Agent': 'FormIQ-Marketplace/1.0'
              }
            });
            
            console.log('ViewSTL Response status:', response.status);
            console.log('ViewSTL Response headers:', Object.fromEntries(response.headers.entries()));
            
            if (response.ok) {
              const blob = await response.blob();
              console.log('Received blob size:', blob.size, 'bytes');
              
              if (blob.size > 0) {
                const result = await this.uploadThumbnailBlob(blob, fileName, userId);
                console.log('STL thumbnail upload result:', result);
                if (result.success) {
                  return result;
                }
              }
            }
          } catch (error) {
            console.error('ViewSTL attempt failed:', error);
            continue;
          }
        }
        
        // If ViewSTL fails, try loading the STL and creating a preview
        return await this.generateSTLPreview(fileUrl, fileName, userId);
      }
      
      // For other formats, generate a fallback
      console.log('Generating fallback thumbnail');
      return await this.generateFallbackThumbnail(fileName, userId);
      
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  private static async generateSTLPreview(
    fileUrl: string,
    fileName: string,
    userId: string
  ): Promise<ThumbnailGenerationResult> {
    try {
      console.log('=== GENERATING STL PREVIEW ===');
      
      // Create a canvas to render the STL
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Cannot create canvas context');
      }
      
      // Try to fetch and parse the STL file
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      
      console.log('STL file size:', arrayBuffer.byteLength);
      
      // Parse STL header to check if it's binary or ASCII
      const header = new Uint8Array(arrayBuffer.slice(0, 80));
      const headerString = new TextDecoder().decode(header);
      const isBinary = !headerString.toLowerCase().includes('solid');
      
      console.log('STL format detected:', isBinary ? 'Binary' : 'ASCII');
      
      // Create a 3D-like preview based on STL data
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, 400, 400);
      
      // Draw a more sophisticated 3D representation
      ctx.save();
      ctx.translate(200, 200);
      
      // Create gradient for 3D effect
      const gradient = ctx.createLinearGradient(-100, -100, 100, 100);
      gradient.addColorStop(0, '#e9ecef');
      gradient.addColorStop(0.5, '#6c757d');
      gradient.addColorStop(1, '#343a40');
      
      // Draw multiple layers to simulate 3D depth
      for (let i = 0; i < 5; i++) {
        const offset = i * 5;
        const size = 80 - (i * 5);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-size/2 + offset, -size/2 + offset, size, size);
        
        // Add some triangular faces to make it look more like STL
        ctx.beginPath();
        ctx.moveTo(-size/2 + offset, -size/2 + offset);
        ctx.lineTo(size/2 + offset, -size/2 + offset);
        ctx.lineTo(0 + offset, size/2 + offset);
        ctx.closePath();
        ctx.fillStyle = '#adb5bd';
        ctx.fill();
      }
      
      // Add file info
      ctx.fillStyle = '#495057';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('STL MODEL', 0, 120);
      ctx.font = '10px Arial';
      ctx.fillStyle = '#6c757d';
      const displayName = fileName.split('.')[0];
      ctx.fillText(displayName.substring(0, 20), 0, 140);
      ctx.fillText(`${(arrayBuffer.byteLength / 1024).toFixed(1)} KB`, 0, 155);
      
      ctx.restore();
      
      return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
          if (blob) {
            console.log('STL preview blob generated, size:', blob.size);
            const result = await this.uploadThumbnailBlob(blob, fileName, userId);
            console.log('STL preview upload result:', result);
            resolve(result);
          } else {
            resolve({ success: false, error: 'Failed to create STL preview' });
          }
        }, 'image/png');
      });
      
    } catch (error) {
      console.error('STL preview generation error:', error);
      return await this.generateFallbackThumbnail(fileName, userId);
    }
  }
  
  private static async generateFallbackThumbnail(
    fileName: string,
    userId: string
  ): Promise<ThumbnailGenerationResult> {
    try {
      console.log('=== FALLBACK THUMBNAIL GENERATION ===');
      
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Cannot create canvas context');
      }
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 400, 400);
      gradient.addColorStop(0, '#f8f9fa');
      gradient.addColorStop(1, '#e9ecef');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 400);
      
      // Draw 3D-looking object
      ctx.save();
      ctx.translate(200, 200);
      
      const size = 100;
      
      // Front face
      ctx.fillStyle = '#6c757d';
      ctx.fillRect(-size/2, -size/2, size, size);
      
      // Top face
      ctx.fillStyle = '#adb5bd';
      ctx.beginPath();
      ctx.moveTo(-size/2, -size/2);
      ctx.lineTo(-size/2 + size/3, -size/2 - size/3);
      ctx.lineTo(size/2 + size/3, -size/2 - size/3);
      ctx.lineTo(size/2, -size/2);
      ctx.closePath();
      ctx.fill();
      
      // Right face
      ctx.fillStyle = '#495057';
      ctx.beginPath();
      ctx.moveTo(size/2, -size/2);
      ctx.lineTo(size/2 + size/3, -size/2 - size/3);
      ctx.lineTo(size/2 + size/3, size/2 - size/3);
      ctx.lineTo(size/2, size/2);
      ctx.closePath();
      ctx.fill();
      
      // Add text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('3D MODEL', 0, size + 30);
      ctx.font = '10px Arial';
      ctx.fillStyle = '#6c757d';
      const displayName = fileName.split('.')[0];
      ctx.fillText(displayName.substring(0, 20), 0, size + 50);
      
      ctx.restore();
      
      return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
          if (blob) {
            console.log('Fallback blob generated, size:', blob.size);
            const result = await this.uploadThumbnailBlob(blob, fileName, userId);
            console.log('Fallback thumbnail upload result:', result);
            resolve(result);
          } else {
            resolve({ success: false, error: 'Failed to create fallback thumbnail' });
          }
        }, 'image/png');
      });
      
    } catch (error) {
      console.error('Fallback thumbnail generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Fallback generation failed'
      };
    }
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
      
      console.log('Uploading thumbnail blob to:', filePath);
      console.log('Blob size:', blob.size, 'bytes');
      
      const { data, error } = await supabase.storage
        .from('3d-models')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Thumbnail upload error:', error);
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('3d-models')
        .getPublicUrl(data.path);

      console.log('Thumbnail uploaded successfully to:', urlData.publicUrl);
      
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
