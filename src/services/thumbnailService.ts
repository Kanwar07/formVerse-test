
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
      
      // Verify the file is accessible first
      try {
        const response = await fetch(fileUrl, { method: 'HEAD' });
        if (!response.ok) {
          console.error('File not accessible:', response.status);
          return await this.generateFallbackThumbnail(fileName, userId);
        }
      } catch (error) {
        console.error('File accessibility check failed:', error);
        return await this.generateFallbackThumbnail(fileName, userId);
      }
      
      // For STL files, try ViewSTL API
      if (fileType.toLowerCase().includes('stl') || fileName.toLowerCase().endsWith('.stl')) {
        console.log('Attempting ViewSTL thumbnail generation...');
        
        const viewStlResult = await this.tryViewSTLGeneration(fileUrl, fileName, userId);
        if (viewStlResult.success) {
          return viewStlResult;
        }
      }
      
      // Generate custom thumbnail for CAD files
      return await this.generateCADThumbnail(fileUrl, fileName, fileType, userId);
      
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      return await this.generateFallbackThumbnail(fileName, userId);
    }
  }
  
  private static async tryViewSTLGeneration(
    fileUrl: string,
    fileName: string,
    userId: string
  ): Promise<ThumbnailGenerationResult> {
    try {
      const viewStlApiUrl = `https://www.viewstl.com/api/thumbnail/512x512?url=${encodeURIComponent(fileUrl)}`;
      console.log('ViewSTL API URL:', viewStlApiUrl);
      
      const response = await fetch(viewStlApiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'image/png, image/jpeg, */*'
        }
      });
      
      if (response.ok && response.headers.get('content-type')?.includes('image')) {
        const blob = await response.blob();
        if (blob.size > 1000) { // Valid image should be larger than 1KB
          const result = await this.uploadThumbnailBlob(blob, fileName, userId);
          if (result.success) {
            console.log('ViewSTL thumbnail generated successfully');
            return result;
          }
        }
      }
    } catch (error) {
      console.error('ViewSTL generation failed:', error);
    }
    
    return { success: false, error: 'ViewSTL generation failed' };
  }
  
  private static async generateCADThumbnail(
    fileUrl: string,
    fileName: string,
    fileType: string,
    userId: string
  ): Promise<ThumbnailGenerationResult> {
    try {
      console.log('Generating custom CAD thumbnail...');
      
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Cannot create canvas context');
      }
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 512, 512);
      gradient.addColorStop(0, '#f8f9fa');
      gradient.addColorStop(1, '#e9ecef');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      
      // Draw 3D-looking CAD model representation
      ctx.save();
      ctx.translate(256, 256);
      
      // Main object
      const size = 120;
      
      // Front face
      ctx.fillStyle = '#6c757d';
      ctx.fillRect(-size/2, -size/2, size, size);
      
      // Top face (isometric view)
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
      
      // Add wireframe lines for CAD look
      ctx.strokeStyle = '#343a40';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      // Grid lines on front face
      for (let i = -size/2; i <= size/2; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, -size/2);
        ctx.lineTo(i, size/2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-size/2, i);
        ctx.lineTo(size/2, i);
        ctx.stroke();
      }
      
      ctx.setLineDash([]);
      
      // Add file type indicator
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('CAD MODEL', 0, size + 40);
      
      ctx.font = '12px Arial';
      ctx.fillStyle = '#6c757d';
      const displayName = fileName.split('.')[0];
      ctx.fillText(displayName.substring(0, 25), 0, size + 60);
      ctx.fillText(fileType.toUpperCase(), 0, size + 80);
      
      ctx.restore();
      
      return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
          if (blob) {
            console.log('CAD thumbnail blob generated, size:', blob.size);
            const result = await this.uploadThumbnailBlob(blob, fileName, userId);
            resolve(result);
          } else {
            resolve({ success: false, error: 'Failed to create CAD thumbnail' });
          }
        }, 'image/png');
      });
      
    } catch (error) {
      console.error('CAD thumbnail generation error:', error);
      return await this.generateFallbackThumbnail(fileName, userId);
    }
  }
  
  private static async generateFallbackThumbnail(
    fileName: string,
    userId: string
  ): Promise<ThumbnailGenerationResult> {
    try {
      console.log('Generating fallback thumbnail...');
      
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Cannot create canvas context');
      }
      
      // Simple gradient background
      const gradient = ctx.createLinearGradient(0, 0, 512, 512);
      gradient.addColorStop(0, '#f8f9fa');
      gradient.addColorStop(1, '#dee2e6');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      
      // Simple 3D cube
      ctx.save();
      ctx.translate(256, 256);
      
      const size = 100;
      
      ctx.fillStyle = '#6c757d';
      ctx.fillRect(-size/2, -size/2, size, size);
      
      ctx.fillStyle = '#adb5bd';
      ctx.beginPath();
      ctx.moveTo(-size/2, -size/2);
      ctx.lineTo(-size/2 + size/4, -size/2 - size/4);
      ctx.lineTo(size/2 + size/4, -size/2 - size/4);
      ctx.lineTo(size/2, -size/2);
      ctx.closePath();
      ctx.fill();
      
      ctx.fillStyle = '#495057';
      ctx.beginPath();
      ctx.moveTo(size/2, -size/2);
      ctx.lineTo(size/2 + size/4, -size/2 - size/4);
      ctx.lineTo(size/2 + size/4, size/2 - size/4);
      ctx.lineTo(size/2, size/2);
      ctx.closePath();
      ctx.fill();
      
      // Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('3D MODEL', 0, size + 40);
      
      ctx.font = '12px Arial';
      ctx.fillStyle = '#6c757d';
      const displayName = fileName.split('.')[0];
      ctx.fillText(displayName.substring(0, 25), 0, size + 60);
      
      ctx.restore();
      
      return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
          if (blob) {
            const result = await this.uploadThumbnailBlob(blob, fileName, userId);
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
      
      console.log('Uploading thumbnail to:', filePath, 'Size:', blob.size);
      
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

      console.log('Thumbnail uploaded successfully:', urlData.publicUrl);
      
      return {
        success: true,
        thumbnailUrl: urlData.publicUrl
      };
    } catch (error) {
      console.error('Thumbnail upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }
}
