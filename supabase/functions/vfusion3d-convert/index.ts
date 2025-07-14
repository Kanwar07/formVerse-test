import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import Replicate from "https://esm.sh/replicate@0.25.2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  console.log(`${req.method} ${req.url}`);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Check environment variables
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!REPLICATE_API_KEY) {
      console.error('REPLICATE_API_KEY is missing')
      return new Response(JSON.stringify({ 
        error: 'REPLICATE_API_KEY is not configured' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials missing')
      return new Response(JSON.stringify({ 
        error: 'Supabase credentials not configured' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    // Initialize clients
    const supabase = createClient(supabaseUrl, supabaseKey)
    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    })

    // Parse request body
    let body;
    try {
      const text = await req.text()
      console.log('Raw request body:', text)
      body = JSON.parse(text)
    } catch (error) {
      console.error("Failed to parse JSON:", error)
      return new Response(JSON.stringify({ 
        error: "Invalid JSON in request body",
        details: error.message 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    console.log("Parsed request body:", body)

    // Handle status check
    if (body.predictionId) {
      console.log("Checking status for prediction:", body.predictionId)
      try {
        const prediction = await replicate.predictions.get(body.predictionId)
        console.log("Prediction status:", prediction.status, "output:", prediction.output)
        
        return new Response(JSON.stringify({
          predictionId: prediction.id,
          status: prediction.status,
          output: prediction.output,
          error: prediction.error
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      } catch (error) {
        console.error("Error checking prediction:", error)
        return new Response(JSON.stringify({ 
          error: "Failed to check prediction status", 
          details: error.message 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        })
      }
    }

    // Handle image conversion
    if (!body.imageUrl) {
      return new Response(JSON.stringify({ 
        error: "Missing imageUrl parameter" 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    console.log("Starting image conversion for:", body.imageUrl)

    try {
      // Use TripoSR for reliable image to 3D conversion
      const prediction = await replicate.predictions.create({
        version: "stabilityai/triposr:4b93b45b1ac4e0ce5faab5c76b2e3d5a90bb7bb62b78ba93e53fd26ad0b4b65e",
        input: {
          image: body.imageUrl,
          do_remove_background: true,
          foreground_ratio: 0.85
        }
      })

      console.log("Prediction created:", prediction.id, "status:", prediction.status)

      // Store in database
      try {
        const { error: dbError } = await supabase
          .from('vfusion3d_jobs')
          .insert({
            prediction_id: prediction.id,
            user_id: body.userId || null,
            image_url: body.imageUrl,
            status: prediction.status || 'starting',
            created_at: new Date().toISOString()
          })

        if (dbError) {
          console.error("Database error:", dbError)
        }
      } catch (dbError) {
        console.error("Failed to store in database:", dbError)
        // Continue anyway
      }

      return new Response(JSON.stringify({
        predictionId: prediction.id,
        status: prediction.status,
        message: "Image to 3D conversion started successfully"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })

    } catch (replicateError) {
      console.error("Replicate API error:", replicateError)
      return new Response(JSON.stringify({ 
        error: "Failed to start prediction", 
        details: replicateError.message 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

  } catch (error) {
    console.error("Unexpected error:", error)
    return new Response(JSON.stringify({ 
      error: "Internal server error", 
      details: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})