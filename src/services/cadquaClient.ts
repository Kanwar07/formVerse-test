/**
 * CADQUA 3D Generation API Client - TypeScript Version
 * 
 * A comprehensive TypeScript client for the CADQUA FastAPI service.
 * Supports image upload, 3D generation, progress tracking, and file downloads.
 */

// Types
export interface GenerationSettings {
  seed?: number;
  randomize_seed?: boolean;
  ss_guidance_strength?: number;
  ss_sampling_steps?: number;
  slat_guidance_strength?: number;
  slat_sampling_steps?: number;
  multiimage_algo?: 'stochastic' | 'multidiffusion';
  mesh_simplify?: number;
  texture_size?: number;
}

export interface GenerationResponse {
  task_id: string;
  video_url: string;
  glb_url: string;
  gaussian_available: boolean;
  message: string;
}

export interface HealthResponse {
  status: string;
  pipeline_loaded: boolean;
  gpu_available: boolean;
}

export interface ProgressEvent {
  step: string;
  progress: number;
  message: string;
  timestamp: Date;
}

export interface ErrorEvent {
  error: Error;
  context: string;
  timestamp: Date;
}

export interface CompleteEvent {
  result: any;
  timestamp: Date;
}

export interface EventHandlers {
  onProgress?: (event: ProgressEvent) => void;
  onError?: (event: ErrorEvent) => void;
  onComplete?: (event: CompleteEvent) => void;
}

export interface FileDownload {
  blob: Blob;
  filename: string;
  url: string;
  size: number;
  type: string;
}

export interface ClientOptions {
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export class CADQUAClient {
  private baseUrl: string;
  private options: Required<ClientOptions>;
  private onProgress?: (event: ProgressEvent) => void;
  private onError?: (event: ErrorEvent) => void;
  private onComplete?: (event: CompleteEvent) => void;

  constructor(baseUrl: string, options: ClientOptions = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.options = {
      timeout: 300000, // 5 minutes timeout to match Edge Function
      retryAttempts: 3,
      retryDelay: 2000,
      ...options
    };
  }

  /**
   * Set event handlers
   */
  setEventHandlers(handlers: EventHandlers): void {
    this.onProgress = handlers.onProgress || undefined;
    this.onError = handlers.onError || undefined;
    this.onComplete = handlers.onComplete || undefined;
  }

  /**
   * Emit progress event
   */
  private _emitProgress(step: string, progress: number, message: string): void {
    if (this.onProgress) {
      this.onProgress({ step, progress, message, timestamp: new Date() });
    }
  }

  /**
   * Emit error event
   */
  private _emitError(error: Error, context: string): void {
    if (this.onError) {
      this.onError({ error, context, timestamp: new Date() });
    }
  }

  /**
   * Emit completion event
   */
  private _emitComplete(result: any): void {
    if (this.onComplete) {
      this.onComplete({ result, timestamp: new Date() });
    }
  }

  /**
   * Make HTTP request with retry logic
   */
  private async _makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const fullUrl = `${this.baseUrl}${url}`;
    
    for (let attempt = 1; attempt <= this.options.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.options.timeout);
        
        const response = await fetch(fullUrl, {
          ...options,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        return response;
        
      } catch (error) {
        if (attempt === this.options.retryAttempts) {
          throw error;
        }
        
        console.warn(`Request attempt ${attempt} failed, retrying...`, (error as Error).message);
        await new Promise(resolve => setTimeout(resolve, this.options.retryDelay * attempt));
      }
    }
    throw new Error('All retry attempts failed');
  }

  /**
   * Check API health status
   */
  async checkHealth(): Promise<HealthResponse> {
    try {
      const response = await this._makeRequest('/health');
      const data = await response.json();
      return data;
    } catch (error) {
      this._emitError(error as Error, 'health_check');
      throw new Error(`Health check failed: ${(error as Error).message}`);
    }
  }

  /**
   * Wait for API to be ready
   */
  async waitForReady(maxRetries: number = 10, delay: number = 5000): Promise<boolean> {
    this._emitProgress('initialization', 0, 'Checking API status...');
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const health = await this.checkHealth();
        
        this._emitProgress('initialization', (attempt / maxRetries) * 50, 
          `API check ${attempt}/${maxRetries}: ${health.status}`);
        
        if (health.pipeline_loaded) {
          this._emitProgress('initialization', 100, 'API ready!');
          return true;
        } else if (health.status === 'unhealthy') {
          throw new Error('API reports unhealthy status');
        }
        
        if (attempt < maxRetries) {
          this._emitProgress('initialization', (attempt / maxRetries) * 50, 
            `Waiting for pipeline to load... (${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        if (attempt === maxRetries) {
          this._emitError(error as Error, 'api_ready_check');
          throw new Error(`API failed to become ready: ${(error as Error).message}`);
        }
      }
    }
    
    return false;
  }

  /**
   * Get debug information
   */
  async getDebugInfo(): Promise<any> {
    try {
      const response = await this._makeRequest('/debug');
      return await response.json();
    } catch (error) {
      this._emitError(error as Error, 'debug_info');
      throw new Error(`Failed to get debug info: ${(error as Error).message}`);
    }
  }

  /**
   * Preprocess an image
   */
  async preprocessImage(imageFile: File): Promise<{ message: string; processed_image: string }> {
    try {
      this._emitProgress('preprocess', 0, 'Starting image preprocessing...');
      
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await this._makeRequest('/preprocess', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      this._emitProgress('preprocess', 100, 'Image preprocessed successfully');
      
      return result;
    } catch (error) {
      this._emitError(error as Error, 'preprocess_image');
      throw new Error(`Preprocessing failed: ${(error as Error).message}`);
    }
  }

  /**
   * Generate 3D model from image(s)
   */
  async generate3D(imageFile: File, options: { settings?: GenerationSettings; multiImages?: File[] } = {}): Promise<GenerationResponse> {
    try {
      this._emitProgress('generate', 0, 'Starting 3D generation...');
      
      // Default generation settings
      const settings: GenerationSettings = {
        randomize_seed: true,
        ss_guidance_strength: 7.5,
        ss_sampling_steps: 12,
        slat_guidance_strength: 3.0,
        slat_sampling_steps: 12,
        multiimage_algo: 'stochastic',
        mesh_simplify: 0.95,
        texture_size: 1024,
        ...options.settings
      };
      
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('settings', JSON.stringify(settings));
      
      // Add multi-images if provided
      if (options.multiImages && options.multiImages.length > 0) {
        options.multiImages.forEach(file => {
          formData.append('multi_images', file);
        });
      }
      
      this._emitProgress('generate', 10, 'Uploading files...');
      
      const response = await this._makeRequest('/generate', {
        method: 'POST',
        body: formData
      });
      
      this._emitProgress('generate', 90, 'Processing complete...');
      const result = await response.json();
      
      this._emitProgress('generate', 100, `Generation successful! Task ID: ${result.task_id}`);
      this._emitComplete(result);
      
      return result;
      
    } catch (error) {
      this._emitError(error as Error, 'generate_3d');
      throw new Error(`3D generation failed: ${(error as Error).message}`);
    }
  }

  /**
   * Download a file from the API
   */
  async downloadFile(type: 'video' | 'glb' | 'gaussian', taskId: string, filename?: string): Promise<FileDownload> {
    try {
      this._emitProgress('download', 0, `Starting ${type} download...`);
      
      const response = await this._makeRequest(`/download/${type}/${taskId}`);
      
      this._emitProgress('download', 50, 'Receiving file...');
      
      const blob = await response.blob();
      
      // Get filename from response headers or use provided name
      const contentDisposition = response.headers.get('content-disposition');
      let downloadFilename = filename;
      
      if (!downloadFilename && contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch) {
          downloadFilename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      if (!downloadFilename) {
        const extensions = { video: 'mp4', glb: 'glb', gaussian: 'ply' };
        downloadFilename = `cadqua_${type}_${taskId}.${extensions[type] || 'bin'}`;
      }
      
      this._emitProgress('download', 100, `Download complete: ${downloadFilename}`);
      
      return {
        blob,
        filename: downloadFilename,
        url: URL.createObjectURL(blob),
        size: blob.size,
        type: blob.type
      };
      
    } catch (error) {
      this._emitError(error as Error, 'download_file');
      throw new Error(`Download failed: ${(error as Error).message}`);
    }
  }

  /**
   * Extract Gaussian splat from generated model
   */
  async extractGaussian(taskId: string): Promise<{ message: string; download_url: string }> {
    try {
      this._emitProgress('extract', 0, 'Starting Gaussian extraction...');
      
      const response = await this._makeRequest(`/extract-gaussian/${taskId}`, {
        method: 'POST'
      });
      
      const result = await response.json();
      this._emitProgress('extract', 100, 'Gaussian extraction complete');
      
      return result;
    } catch (error) {
      this._emitError(error as Error, 'extract_gaussian');
      throw new Error(`Gaussian extraction failed: ${(error as Error).message}`);
    }
  }

  /**
   * Clean up task files on server
   */
  async cleanupTask(taskId: string): Promise<{ message: string }> {
    try {
      const response = await this._makeRequest(`/cleanup/${taskId}`, {
        method: 'DELETE'
      });
      
      return await response.json();
    } catch (error) {
      this._emitError(error as Error, 'cleanup_task');
      throw new Error(`Cleanup failed: ${(error as Error).message}`);
    }
  }

  /**
   * Complete 3D generation workflow
   */
  async completeWorkflow(imageFile: File, options: {
    settings?: GenerationSettings;
    multiImages?: File[];
    preprocess?: boolean;
    downloadVideo?: boolean;
    downloadGLB?: boolean;
    downloadGaussian?: boolean;
    cleanup?: boolean;
  } = {}): Promise<{
    taskId: string;
    result: GenerationResponse;
    downloads: { [key: string]: FileDownload };
  }> {
    let taskId: string | null = null;
    
    try {
      // Step 1: Wait for API to be ready
      await this.waitForReady();
      
      // Step 2: Optional preprocessing
      if (options.preprocess) {
        await this.preprocessImage(imageFile);
      }
      
      // Step 3: Generate 3D model
      const result = await this.generate3D(imageFile, options);
      taskId = result.task_id;
      
      // Step 4: Download files
      const downloads: { [key: string]: FileDownload } = {};
      
      if (options.downloadVideo !== false) {
        downloads.video = await this.downloadFile('video', taskId);
      }
      
      if (options.downloadGLB !== false) {
        downloads.glb = await this.downloadFile('glb', taskId);
      }
      
      if (options.downloadGaussian) {
        await this.extractGaussian(taskId);
        downloads.gaussian = await this.downloadFile('gaussian', taskId);
      }
      
      // Step 5: Cleanup (optional)
      if (options.cleanup !== false) {
        await this.cleanupTask(taskId);
      }
      
      return {
        taskId,
        result,
        downloads
      };
      
    } catch (error) {
      // Cleanup on error if task was created
      if (taskId && options.cleanup !== false) {
        try {
          await this.cleanupTask(taskId);
        } catch (cleanupError) {
          console.warn('Failed to cleanup task after error:', cleanupError);
        }
      }
      throw error;
    }
  }
}

// Utility functions

/**
 * Trigger automatic file download
 */
export function triggerDownload(fileData: FileDownload): void {
  const link = document.createElement('a');
  link.href = fileData.url;
  link.download = fileData.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up object URL after download
  setTimeout(() => URL.revokeObjectURL(fileData.url), 1000);
}

/**
 * Validate file before upload
 */
export function validateImageFile(file: File, options: {
  maxSize?: number;
  allowedTypes?: string[];
} = {}): boolean {
  const maxSize = options.maxSize || 10 * 1024 * 1024; // 10MB default
  const allowedTypes = options.allowedTypes || ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  
  if (!file) {
    throw new Error('No file selected');
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
  }
  
  if (file.size > maxSize) {
    throw new Error(`File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`);
  }
  
  return true;
}