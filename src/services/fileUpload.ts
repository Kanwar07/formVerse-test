
import { supabase } from '@/integrations/supabase/client';
import { APIService } from './api';
import CryptoJS from 'crypto-js';

export class FileUploadService {
  private static readonly ALLOWED_EXTENSIONS = ['.stl', '.obj', '.step', '.stp', '.ply', '.3mf'];
  private static readonly MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  
  static async validateFile(file: File): Promise<{ valid: boolean; error?: string }> {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: 'File size exceeds 100MB limit' };
    }

    // Check file extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!this.ALLOWED_EXTENSIONS.includes(extension)) {
      return { 
        valid: false, 
        error: `File type not supported. Allowed types: ${this.ALLOWED_EXTENSIONS.join(', ')}` 
      };
    }

    // Additional validation for CAD files
    if (!await this.validateCADFile(file)) {
      return { valid: false, error: 'File appears to be corrupted or invalid' };
    }

    return { valid: true };
  }

  private static async validateCADFile(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(content);
        
        // Basic file signature validation
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        
        switch (extension) {
          case '.stl':
            // Check for STL binary signature or ASCII "solid"
            const stlText = new TextDecoder().decode(bytes.slice(0, 5));
            const isBinarySTL = bytes[0] === 0x00 || bytes[0] === 0x80;
            const isAsciiSTL = stlText.toLowerCase().startsWith('solid');
            resolve(isBinarySTL || isAsciiSTL);
            break;
          case '.obj':
            // Check for OBJ file format markers
            const objText = new TextDecoder().decode(bytes.slice(0, 100));
            resolve(objText.includes('v ') || objText.includes('vn ') || objText.includes('f '));
            break;
          case '.step':
          case '.stp':
            // Check for STEP file header
            const stepText = new TextDecoder().decode(bytes.slice(0, 20));
            resolve(stepText.includes('ISO-10303'));
            break;
          default:
            resolve(true); // Allow other extensions for now
        }
      };
      reader.onerror = () => resolve(false);
      reader.readAsArrayBuffer(file);
    });
  }

  static generateFileHash(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as ArrayBuffer;
        const wordArray = CryptoJS.lib.WordArray.create(content);
        const hash = CryptoJS.SHA256(wordArray).toString();
        resolve(hash);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  static async uploadModelFile(
    file: File,
    modelData: {
      name: string;
      description?: string;
      tags?: string[];
      category?: string;
    }
  ) {
    // Validate file
    const validation = await this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Generate file hash
    const fileHash = await this.generateFileHash(file);

    // Check for duplicate files
    const { data: existingModel } = await supabase
      .from('models')
      .select('id, name')
      .eq('file_hash', fileHash)
      .single();

    if (existingModel) {
      throw new Error(`This file already exists as "${existingModel.name}"`);
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const filePath = `models/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('3d-models')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Create model record
    const modelRecord = await APIService.uploadModel({
      name: modelData.name,
      description: modelData.description,
      file_path: uploadData.path,
      file_type: fileExtension || 'unknown',
      file_size_mb: Number((file.size / (1024 * 1024)).toFixed(2)),
      file_hash: fileHash,
      tags: modelData.tags,
      category: modelData.category
    });

    return modelRecord;
  }

  static async uploadThumbnail(file: File, modelId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Validate image file
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit for images
      throw new Error('Image size must be less than 5MB');
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `${user.id}/${modelId}/thumbnail.${fileExtension}`;
    const filePath = `thumbnails/${fileName}`;

    const { data, error } = await supabase.storage
      .from('model-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Update model with preview image
    await supabase
      .from('models')
      .update({ preview_image: data.path })
      .eq('id', modelId)
      .eq('user_id', user.id);

    return data;
  }

  static getFileUrl(bucket: string, path: string) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  static async generateSecureDownloadUrl(modelId: string, licenseId: string) {
    try {
      // Generate download token
      const token = await APIService.generateDownloadToken(modelId, licenseId);
      
      // Return secure download URL
      return `/api/download/${token}`;
    } catch (error) {
      console.error('Error generating download URL:', error);
      throw error;
    }
  }
}
