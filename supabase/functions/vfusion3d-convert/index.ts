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

    console.log("Starting TripoSR 3D conversion for image:", body.imageUrl.substring(0, 50) + "...")
    
    // Start the TripoSR prediction using the correct model
    const prediction = await replicate.predictions.create({
      version: "e0d3fe8abce3ba86497ea3530d9eae59af7b2231b6c82bedfc32b0732d35ec3a", // TripoSR model latest version
      input: {
        image_path: body.imageUrl,
        do_remove_background: true,
        foreground_ratio: 0.85
      }
    })

    console.log("TripoSR prediction started:", prediction.id)

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
      message: "TripoSR 3D conversion started. This may take 1-2 minutes."
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