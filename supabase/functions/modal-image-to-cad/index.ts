import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client } from "https://cdn.skypack.dev/@gradio/client";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Modal Image to CAD conversion request received');
    
    // Get the form data from the request
    const formData = await req.formData();
    const imageFile = formData.get('input_image') as File;
    
    if (!imageFile) {
      return new Response(JSON.stringify({ error: 'No image file provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return new Response(JSON.stringify({ error: 'Invalid file type. Please upload a valid image (JPG, PNG).' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (imageFile.size > maxSize) {
      return new Response(JSON.stringify({ error: 'Image file is too large. Maximum size is 10MB.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Image file details:', {
      name: imageFile.name,
      size: imageFile.size,
      type: imageFile.type
    });

    console.log('Connecting to Gradio client...');
    
    // Test connection to the API endpoint first
    try {
      const testResponse = await fetch("https://formversedude--cadqua-3d-generator-gradio-app.modal.run", {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      console.log('API endpoint test response status:', testResponse.status);
    } catch (testError) {
      console.error('API endpoint test failed:', testError);
      return new Response(JSON.stringify({ 
        error: 'CADQUA API endpoint is not accessible',
        details: 'The AI model service appears to be down or unreachable'
      }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Connect to the Gradio client with timeout handling
    const client = await Promise.race([
      Client.connect("https://formversedude--cadqua-3d-generator-gradio-app.modal.run"),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 30000)
      )
    ]) as any;
    
    console.log('Gradio client connected, calling API endpoint...');

    // Call the specific endpoint with proper parameters and timeout
    const result = await Promise.race([
      client.predict("/generate_and_extract__glb", {
        image: imageFile,
        multiimages: [],
        is_multiimage: false,
        seed: 0,
        randomize_seed: true,
        ss_guidance_strength: 7.5,
        ss_sampling_steps: 12,
        slat_guidance_strength: 3.0,
        slat_sampling_steps: 12,
        multiimage_algo: "stochastic",
        mesh_simplify: 0.95,
        texture_size: 1024
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API call timeout')), 120000) // 2 minutes timeout
      )
    ]) as any;

    console.log('Gradio API success response:', result);

    // Check if the response contains the expected GLB file path
    if (!result || !result.data || !result.data[2]) {
      console.error('Invalid response structure:', result);
      return new Response(JSON.stringify({ 
        error: 'Invalid response from model generation API',
        details: 'Expected GLB file path not found in response'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in modal-image-to-cad function:', error);
    
    // Provide more specific error messages based on error type
    let errorMessage = 'Internal server error';
    let errorDetails = error.message;
    let statusCode = 500;
    
    if (error.message.includes('Connection timeout')) {
      errorMessage = 'Unable to connect to CADQUA AI service';
      errorDetails = 'Connection timed out. The AI service may be temporarily unavailable.';
      statusCode = 503;
    } else if (error.message.includes('API call timeout')) {
      errorMessage = 'Model generation timed out';
      errorDetails = 'The AI generation process took too long. Please try with a smaller image.';
      statusCode = 504;
    } else if (error.message.includes('fetch')) {
      errorMessage = 'Failed to connect to CADQUA AI service';
      errorDetails = 'Network connection failed. Please check your internet connection.';
      statusCode = 503;
    } else if (error.message.includes('not accessible')) {
      errorMessage = 'CADQUA AI service unavailable';
      errorDetails = 'The AI model service is currently down. Please try again later.';
      statusCode = 503;
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage, 
      details: errorDetails 
    }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});