import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
};

const CADQUA_API_URL = "https://formversedude--cadqua-3d-api-fastapi-app.modal.run";

// Utility function for exponential backoff delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Health check with optional fallback
async function performHealthCheck(): Promise<{ success: boolean; retryAfter?: number }> {
  try {
    console.log('Performing optional health check...');
    
    const response = await fetch(CADQUA_API_URL + '/health', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000) // Reduced to 5s timeout
    });
    
    if (response.ok) {
      const health = await response.json();
      console.log('Health check passed:', health);
      return { success: true };
    }
    
    console.log(`Health check failed with status: ${response.status}, proceeding anyway`);
    return { success: true }; // Proceed even if health check fails
    
  } catch (error) {
    console.log('Health check failed, proceeding without health check:', error);
    return { success: true }; // Proceed even if health check fails
  }
}

// Call Modal API directly via HTTP
async function callModalAPI(imageFile: File): Promise<any> {
  console.log('Calling Modal API for 3D generation...');
  
  try {
    // Create FormData for the FastAPI endpoint
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Add generation settings exactly as specified
    const settings = {
      randomize_seed: true,
      ss_guidance_strength: 7.5,
      ss_sampling_steps: 12,
      slat_guidance_strength: 3.0,
      slat_sampling_steps: 12,
      multiimage_algo: 'stochastic',
      mesh_simplify: 0.95,
      texture_size: 1024
    };
    formData.append('settings', JSON.stringify(settings));
    
    console.log('Request payload:', {
      method: 'POST',
      url: CADQUA_API_URL + '/generate',
      headers: {
        'Accept': 'application/json',
      },
      fileSize: imageFile.size,
      fileName: imageFile.name,
      fileType: imageFile.type,
      settings: settings
    });
    
    console.log('Sending request to Modal API...');
    
    // Call the Modal API with 5-minute timeout
    const response = await Promise.race([
      fetch(CADQUA_API_URL + '/generate', {
        method: 'POST',
        body: formData
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 300000) // 5 minutes
      )
    ]);
    
    console.log('Modal API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Modal API error response:', errorText);
      throw new Error(`Modal API returned ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Modal API success response:', result);
    
    // Return the exact format from the API specification
    if (result.task_id) {
      return {
        task_id: result.task_id,
        video_url: result.video_url,
        glb_url: result.glb_url,
        gaussian_available: result.gaussian_available || true,
        message: result.message || '3D model generated successfully',
        api_base_url: CADQUA_API_URL
      };
    }
    
    throw new Error('No task_id in response from Modal API');
    
  } catch (error) {
    console.error('Modal API call failed:', error);
    throw error;
  }
}


serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Handle download requests
  const url = new URL(req.url);
  const isDownloadRequest = req.method === 'POST' && (url.pathname.includes('/download') || url.searchParams.get('action') === 'download');
  
  if (isDownloadRequest) {
    try {
      const body = await req.json();
      const { task_id, file_type, api_base_url } = body;
      
      if (!task_id || !file_type) {
        return new Response(JSON.stringify({ 
          error: 'Missing task_id or file_type',
          code: 'MISSING_PARAMS' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      console.log(`Downloading ${file_type} for task ${task_id}...`);
      
      const modalUrl = api_base_url || CADQUA_API_URL;
      const response = await fetch(`${modalUrl}/download/${file_type}/${task_id}`, {
        method: 'GET',
        signal: AbortSignal.timeout(60000) // 1 minute timeout
      });
      
      if (!response.ok) {
        throw new Error(`Modal API returned ${response.status}: ${response.statusText}`);
      }
      
      const fileBlob = await response.blob();
      
      return new Response(fileBlob, {
        headers: {
          ...corsHeaders,
          'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
          'Content-Disposition': response.headers.get('content-disposition') || `attachment; filename="cadqua_${file_type}_${task_id}.${file_type === 'video' ? 'mp4' : 'glb'}"`,
        },
      });
      
    } catch (error) {
      console.error('Download error:', error);
      return new Response(JSON.stringify({ 
        error: 'Download failed',
        details: (error as Error).message,
        code: 'DOWNLOAD_FAILED'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  try {
    console.log('Modal Image to CAD conversion request received');
    
    // Get the form data from the request
    const formData = await req.formData();
    const imageFile = formData.get('image') as File || formData.get('input_image') as File;
    
    if (!imageFile) {
      return new Response(JSON.stringify({ 
        error: 'No image file provided',
        code: 'MISSING_FILE' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return new Response(JSON.stringify({ 
        error: 'Invalid file type. Please upload a valid image (JPG, PNG).',
        code: 'INVALID_FILE_TYPE'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      return new Response(JSON.stringify({ 
        error: 'Image file is too large. Maximum size is 10MB.',
        code: 'FILE_TOO_LARGE'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Image file details:', {
      name: imageFile.name,
      size: imageFile.size,
      type: imageFile.type
    });

    // Call Modal API directly
    console.log('Starting model generation via Modal API...');
    const result = await callModalAPI(imageFile);

    console.log('Model generation completed successfully');
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in modal-image-to-cad function:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Model generation failed',
      details: (error as Error).message,
      code: 'GENERATION_FAILED'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});