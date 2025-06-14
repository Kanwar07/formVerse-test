
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
      console.log('Generating thumbnail for:', fileName, 'Type:', fileType);
      
      // For STL files, use ViewSTL API
      if (fileType.toLowerCase().includes('stl') || fileName.toLowerCase().endsWith('.stl')) {
        return await this.generateSTLThumbnail(fileUrl, fileName, userId);
      }
      
      // For other formats, generate a simple geometric preview
      return await this.generateFallbackThumbnail(fileName, userId);
      
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
      console.log('Generating STL thumbnail using ViewSTL API for:', fileUrl);
      
      // Use ViewSTL API to generate thumbnail
      const viewStlUrl = `https://www.viewstl.com/api/thumbnail/512x512?url=${encodeURIComponent(fileUrl)}`;
      
      const response = await fetch(viewStlUrl, {
        method: 'GET',
        headers: {
          'Accept': 'image/png'
        }
      });
      
      if (!response.ok) {
        console.error('ViewSTL API error:', response.status, response.statusText);
        return await this.generateFallbackThumbnail(fileName, userId);
      }
      
      const blob = await response.blob();
      
      if (blob.size === 0) {
        console.error('ViewSTL returned empty blob');
        return await this.generateFallbackThumbnail(fileName, userId);
      }
      
      return await this.uploadThumbnailBlob(blob, fileName, userId);
      
    } catch (error) {
      console.error('STL thumbnail generation failed:', error);
      return await this.generateFallbackThumbnail(fileName, userId);
    }
  }
  
  private static async generateFallbackThumbnail(
    fileName: string,
    userId: string
  ): Promise<ThumbnailGenerationResult> {
    try {
      // Create a simple canvas with 3D-looking geometric shape
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Cannot create canvas context');
      }
      
      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, 512, 512);
      gradient.addColorStop(0, '#f8f9fa');
      gradient.addColorStop(1, '#e9ecef');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      
      // Draw a 3D-looking object
      ctx.save();
      ctx.translate(256, 256);
      
      // Draw a cube in isometric view
      const size = 120;
      
      // Front face
      ctx.fillStyle = '#6c757d';
      ctx.fillRect(-size/2, -size/2, size, size);
      
      // Top face (lighter)
      ctx.fillStyle = '#adb5bd';
      ctx.beginPath();
      ctx.moveTo(-size/2, -size/2);
      ctx.lineTo(-size/2 + size/3, -size/2 - size/3);
      ctx.lineTo(size/2 + size/3, -size/2 - size/3);
      ctx.lineTo(size/2, -size/2);
      ctx.closePath();
      ctx.fill();
      
      // Right face (darker)
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
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('3D MODEL', 0, size + 40);
      ctx.font = '12px Arial';
      ctx.fillStyle = '#6c757d';
      ctx.fillText(fileName.split('.')[0], 0, size + 60);
      
      ctx.restore();
      
      // Convert to blob and upload
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
      
      console.log('Uploading thumbnail to path:', filePath);
      
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
      console.error('Thumbnail upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }
}
