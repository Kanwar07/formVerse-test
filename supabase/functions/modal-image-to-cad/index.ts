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

    // Connect to the Gradio client
    const client = await Client.connect("https://formversedude--cadqua-3d-generator-gradio-app.modal.run");
    
    console.log('Calling generate_and_extract__glb endpoint...');

    // Call the specific endpoint with proper parameters
    const result = await client.predict("/generate_and_extract__glb", {
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
    });

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
    
    // Provide more specific error messages
    let errorMessage = 'Internal server error';
    let errorDetails = error.message;
    
    if (error.message.includes('fetch')) {
      errorMessage = 'Failed to connect to model generation API';
      errorDetails = 'The CADQUA API service may be temporarily unavailable';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Model generation timed out';
      errorDetails = 'The conversion process took too long. Please try with a smaller image.';
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage, 
      details: errorDetails 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});