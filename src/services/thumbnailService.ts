
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
      
      // Generate enhanced CAD thumbnail for all formats including STEP
      return await this.generateEnhancedCADThumbnail(fileUrl, fileName, fileType, userId);
      
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
  
  private static async generateEnhancedCADThumbnail(
    fileUrl: string,
    fileName: string,
    fileType: string,
    userId: string
  ): Promise<ThumbnailGenerationResult> {
    try {
      console.log('=== Generating Enhanced CAD Thumbnail ===');
      console.log('File type:', fileType);
      
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Cannot create canvas context');
      }
      
      // Create professional gradient background
      const gradient = ctx.createLinearGradient(0, 0, 512, 512);
      gradient.addColorStop(0, '#f8fafc');
      gradient.addColorStop(0.5, '#e2e8f0');
      gradient.addColorStop(1, '#cbd5e1');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      
      // Draw enhanced CAD model based on file type
      ctx.save();
      ctx.translate(256, 256);
      
      const fileExt = fileType.toLowerCase();
      
      if (fileExt.includes('step') || fileExt.includes('stp') || fileExt.includes('iges') || fileExt.includes('igs')) {
        this.drawSTEPRepresentation(ctx);
      } else if (fileExt.includes('stl')) {
        this.drawSTLRepresentation(ctx);
      } else if (fileExt.includes('obj')) {
        this.drawOBJRepresentation(ctx);
      } else {
        this.drawGenericCADRepresentation(ctx);
      }
      
      ctx.restore();
      
      // Add professional file type badge
      ctx.fillStyle = '#4f46e5';
      ctx.fillRect(20, 20, 100, 35);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(fileType.toUpperCase(), 30, 42);
      
      // Add file name at bottom
      ctx.fillStyle = '#374151';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      const displayName = fileName.split('.')[0];
      const truncatedName = displayName.length > 30 ? displayName.substring(0, 27) + '...' : displayName;
      ctx.fillText(truncatedName, 256, 480);
      
      // Add FormVerse branding
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px Arial';
      ctx.fillText('FormVerse CAD Preview', 256, 500);
      
      return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
          if (blob) {
            console.log('Enhanced CAD thumbnail generated, size:', blob.size);
            const result = await this.uploadThumbnailBlob(blob, fileName, userId);
            resolve(result);
          } else {
            resolve({ success: false, error: 'Failed to create enhanced CAD thumbnail' });
          }
        }, 'image/png', 0.9);
      });
      
    } catch (error) {
      console.error('Enhanced CAD thumbnail generation error:', error);
      return await this.generateFallbackThumbnail(fileName, userId);
    }
  }

  private static drawSTEPRepresentation(ctx: CanvasRenderingContext2D) {
    // STEP files often contain complex mechanical parts - draw a sophisticated representation
    const size = 140;
    
    // Main cylindrical body (like a bearing or gear)
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.6, size * 0.4, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Inner hole
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.25, size * 0.15, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Gear teeth or flanges
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * 2 * Math.PI;
      const x = Math.cos(angle) * size * 0.7;
      const y = Math.sin(angle) * size * 0.45;
      
      ctx.fillStyle = '#475569';
      ctx.fillRect(x - 8, y - 4, 16, 8);
    }
    
    // Highlight and shadow for 3D effect
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.ellipse(-size * 0.1, -size * 0.1, size * 0.6, size * 0.4, 0, 0, Math.PI);
    ctx.fill();
    
    // Technical drawing style annotations
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    
    // Dimension lines
    ctx.beginPath();
    ctx.moveTo(-size * 0.8, size * 0.6);
    ctx.lineTo(size * 0.8, size * 0.6);
    ctx.stroke();
    
    // Dimension arrows
    ctx.beginPath();
    ctx.moveTo(-size * 0.8, size * 0.6);
    ctx.lineTo(-size * 0.75, size * 0.55);
    ctx.moveTo(-size * 0.8, size * 0.6);
    ctx.lineTo(-size * 0.75, size * 0.65);
    ctx.stroke();
    
    // Add "STEP" label
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('STEP/IGES', 0, size + 30);
  }

  private static drawSTLRepresentation(ctx: CanvasRenderingContext2D) {
    // STL files are often 3D printed parts - draw a faceted representation
    const size = 120;
    
    // Main triangulated surface
    ctx.fillStyle = '#6366f1';
    const triangles = 8;
    for (let i = 0; i < triangles; i++) {
      const angle = (i / triangles) * 2 * Math.PI;
      const nextAngle = ((i + 1) / triangles) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
      ctx.lineTo(Math.cos(nextAngle) * size, Math.sin(nextAngle) * size);
      ctx.closePath();
      
      // Alternate colors for faceted effect
      ctx.fillStyle = i % 2 === 0 ? '#6366f1' : '#8b5cf6';
      ctx.fill();
      
      // Add triangle outlines
      ctx.strokeStyle = '#3730a3';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    // Add "STL" label
    ctx.fillStyle = '#3730a3';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('STL MESH', 0, size + 30);
  }

  private static drawOBJRepresentation(ctx: CanvasRenderingContext2D) {
    // OBJ files can contain complex meshes - draw a wireframe representation
    const size = 120;
    
    // Main object faces
    ctx.fillStyle = '#10b981';
    ctx.fillRect(-size/2, -size/2, size, size);
    
    // 3D effect - top face
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.moveTo(-size/2, -size/2);
    ctx.lineTo(-size/2 + size/3, -size/2 - size/3);
    ctx.lineTo(size/2 + size/3, -size/2 - size/3);
    ctx.lineTo(size/2, -size/2);
    ctx.closePath();
    ctx.fill();
    
    // Wireframe overlay
    ctx.strokeStyle = '#065f46';
    ctx.lineWidth = 2;
    
    // Grid pattern
    for (let i = -size/2; i <= size/2; i += size/4) {
      ctx.beginPath();
      ctx.moveTo(i, -size/2);
      ctx.lineTo(i, size/2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(-size/2, i);
      ctx.lineTo(size/2, i);
      ctx.stroke();
    }
    
    // Add "OBJ" label
    ctx.fillStyle = '#065f46';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('OBJ MESH', 0, size + 30);
  }

  private static drawGenericCADRepresentation(ctx: CanvasRenderingContext2D) {
    // Generic CAD representation
    const size = 120;
    
    // Main object
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(-size/2, -size/2, size, size);
    
    // 3D isometric effect
    ctx.fillStyle = '#9ca3af';
    ctx.beginPath();
    ctx.moveTo(-size/2, -size/2);
    ctx.lineTo(-size/2 + size/3, -size/2 - size/3);
    ctx.lineTo(size/2 + size/3, -size/2 - size/3);
    ctx.lineTo(size/2, -size/2);
    ctx.closePath();
    ctx.fill();
    
    // Right face
    ctx.fillStyle = '#4b5563';
    ctx.beginPath();
    ctx.moveTo(size/2, -size/2);
    ctx.lineTo(size/2 + size/3, -size/2 - size/3);
    ctx.lineTo(size/2 + size/3, size/2 - size/3);
    ctx.lineTo(size/2, size/2);
    ctx.closePath();
    ctx.fill();
    
    // Add "CAD" label
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CAD MODEL', 0, size + 30);
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
