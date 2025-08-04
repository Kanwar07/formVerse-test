import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    console.log('Image file details:', {
      name: imageFile.name,
      size: imageFile.size,
      type: imageFile.type
    });

    // Create FormData for the Modal API
    const modalFormData = new FormData();
    modalFormData.append('input_image', imageFile);

    console.log('Sending request to Modal API...');

    // Call the Modal API
    const modalResponse = await fetch('https://formversedude--cadqua-3d-generator-gradio-app.modal.run/api/predict', {
      method: 'POST',
      body: modalFormData,
    });

    console.log('Modal API response status:', modalResponse.status);

    if (!modalResponse.ok) {
      const errorText = await modalResponse.text();
      console.error('Modal API error:', errorText);
      return new Response(JSON.stringify({ 
        error: 'Modal API request failed', 
        details: errorText,
        status: modalResponse.status 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = await modalResponse.json();
    console.log('Modal API success response:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in modal-image-to-cad function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});