import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
};

const CADQUA_API_URL = "https://formversedude--cadqua-3d-generator-gradio-app.modal.run";

// Utility function for exponential backoff delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Health check with retries
async function performHealthCheck(): Promise<{ success: boolean; retryAfter?: number }> {
  const maxRetries = 3;
  const baseDelay = 1000; // 1s

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`Health check attempt ${attempt + 1}/${maxRetries}`);
      
      const response = await fetch(CADQUA_API_URL, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(10000) // 10s timeout
      });
      
      if (response.ok) {
        console.log('Health check passed');
        return { success: true };
      }
      
      console.log(`Health check failed with status: ${response.status}`);
    } catch (error) {
      console.error(`Health check attempt ${attempt + 1} failed:`, error);
    }
    
    if (attempt < maxRetries - 1) {
      const delayMs = baseDelay * Math.pow(2, attempt);
      console.log(`Waiting ${delayMs}ms before next attempt...`);
      await delay(delayMs);
    }
  }
  
  // All attempts failed - suggest retry after 30 seconds
  return { success: false, retryAfter: 30 };
}

// Call Modal API directly via HTTP
async function callModalAPI(imageFile: File): Promise<any> {
  const maxRetries = 2;
  const retryDelay = 3000; // 3s
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`Modal API call attempt ${attempt + 1}/${maxRetries + 1}`);
      console.log(`Calling Modal API: ${CADQUA_API_URL}`);
      
      // Create FormData for the Modal API
      const formData = new FormData();
      formData.append('input_image', imageFile);
      
      console.log('Request payload:', {
        method: 'POST',
        url: CADQUA_API_URL + '/run/generate_and_extract__glb',
        headers: {
          'Accept': 'application/json',
        },
        fileSize: imageFile.size,
        fileName: imageFile.name,
        fileType: imageFile.type
      });
      
      const response = await Promise.race([
        fetch(CADQUA_API_URL + '/run/generate_and_extract__glb', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
          body: formData
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 120000) // 2 minutes
        )
      ]);
      
      console.log('Modal API response status:', response.status);
      console.log('Modal API response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Modal API error response:', errorText);
        throw new Error(`Modal API returned ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Modal API success response:', result);
      
      // Validate response structure
      if (!result || !result.data || !result.data[2]) {
        throw new Error('Invalid response structure - no GLB file generated');
      }
      
      const glbUrl = result.data[2];
      if (typeof glbUrl !== 'string' || !glbUrl.trim()) {
        throw new Error('Invalid GLB URL in response');
      }
      
      console.log('Modal API call successful, GLB URL:', glbUrl);
      return result;
      
    } catch (error) {
      console.error(`Modal API attempt ${attempt + 1} failed:`, error);
      
      if (attempt < maxRetries && !(error as Error).message.includes('timeout')) {
        console.log(`Retrying in ${retryDelay}ms...`);
        await delay(retryDelay);
      } else {
        throw error;
      }
    }
  }
}


serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Modal Image to CAD conversion request received');
    
    // Get the form data from the request
    const formData = await req.formData();
    const imageFile = formData.get('input_image') as File;
    
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
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
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

    // Step 1: Health check with retries
    console.log('Performing health check...');
    const healthCheck = await performHealthCheck();
    
    if (!healthCheck.success) {
      return new Response(JSON.stringify({ 
        error: 'CADQUA AI service is currently unavailable',
        details: 'The service may be starting up or experiencing issues',
        code: 'SERVICE_UNAVAILABLE',
        retryAfter: healthCheck.retryAfter
      }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Step 2: Call Modal API directly
    console.log('Starting model generation via Modal API...');
    const result = await callModalAPI(imageFile);

    console.log('Model generation completed successfully');
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in modal-image-to-cad function:', error);
    
    // Determine error type and appropriate response
    let errorMessage = 'Internal server error';
    let errorDetails = (error as Error).message;
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';
    let retryAfter;
    
    if ((error as Error).message.includes('Connection timeout')) {
      errorMessage = 'Unable to connect to CADQUA AI service';
      errorDetails = 'Connection timed out. The service may be starting up.';
      statusCode = 503;
      errorCode = 'CONNECTION_TIMEOUT';
      retryAfter = 30;
    } else if ((error as Error).message.includes('Generation timeout')) {
      errorMessage = 'Model generation timed out';
      errorDetails = 'The generation process took too long. Please try with a smaller image.';
      statusCode = 504;
      errorCode = 'GENERATION_TIMEOUT';
      retryAfter = 10;
    } else if ((error as Error).message.includes('Invalid response')) {
      errorMessage = 'Model generation failed';
      errorDetails = 'The AI service returned an invalid response. Please try again.';
      statusCode = 502;
      errorCode = 'INVALID_RESPONSE';
      retryAfter = 15;
    } else if ((error as Error).message.includes('fetch')) {
      errorMessage = 'Failed to connect to CADQUA AI service';
      errorDetails = 'Network connection failed. Please check your internet connection.';
      statusCode = 503;
      errorCode = 'NETWORK_ERROR';
      retryAfter = 20;
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage, 
      details: errorDetails,
      code: errorCode,
      retryAfter
    }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});