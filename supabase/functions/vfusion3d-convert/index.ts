import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import Replicate from "https://esm.sh/replicate@0.25.2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY')
    if (!REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY is not set')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    })

    const body = await req.json()
    console.log("Received request:", { 
      hasImageUrl: !!body.imageUrl, 
      predictionId: body.predictionId 
    })

    // If it's a status check request
    if (body.predictionId) {
      console.log("Checking status for prediction:", body.predictionId)
      const prediction = await replicate.predictions.get(body.predictionId)
      console.log("Status check response:", prediction.status)
      
      return new Response(JSON.stringify({
        id: prediction.id,
        status: prediction.status,
        output: prediction.output,
        error: prediction.error
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // If it's a generation request
    if (!body.imageUrl) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required field: imageUrl is required" 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log("Starting VFusion3D conversion for image:", body.imageUrl.substring(0, 50) + "...")
    
    // Start the VFusion3D prediction
    const prediction = await replicate.predictions.create({
      version: "c7ad7def7f1b1b7a6dcf7b0ccecfef1ec7e4a1b8b6e5e3e0f1e8e9b5a6e3b0e1", // VFusion3D model version
      input: {
        image_path: body.imageUrl,
        guidance_scale: 3.0,
        num_inference_steps: 45,
        seed: body.seed || Math.floor(Math.random() * 1000000)
      }
    })

    console.log("VFusion3D prediction started:", prediction.id)

    // Store the prediction info in database for tracking
    const { error: dbError } = await supabase
      .from('vfusion3d_jobs')
      .insert({
        prediction_id: prediction.id,
        user_id: body.userId,
        image_url: body.imageUrl,
        status: 'processing',
        created_at: new Date().toISOString()
      })

    if (dbError) {
      console.error("Error storing prediction in database:", dbError)
      // Continue anyway, as the prediction is already started
    }

    return new Response(JSON.stringify({
      predictionId: prediction.id,
      status: prediction.status,
      message: "VFusion3D conversion started. This may take 2-5 minutes."
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Error in vfusion3d-convert function:", error)
    return new Response(JSON.stringify({ 
      error: "Failed to process image", 
      details: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})