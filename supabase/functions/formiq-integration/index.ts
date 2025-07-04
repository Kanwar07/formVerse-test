
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, modelId, fileUrl } = await req.json()

    if (action === 'analyze') {
      // Call FormIQ API (simulated for now)
      const formiqApiUrl = Deno.env.get('FORMIQ_API_URL')
      const formiqApiKey = Deno.env.get('FORMIQ_API_KEY')

      if (!formiqApiUrl || !formiqApiKey) {
        // Simulate analysis for demo
        const simulatedAnalysis = {
          printability_score: Math.floor(Math.random() * 40) + 60, // 60-100
          material_recommendations: ['PLA', 'ABS', 'PETG'].slice(0, Math.floor(Math.random() * 3) + 1),
          printing_techniques: ['FDM', 'SLA'].slice(0, Math.floor(Math.random() * 2) + 1),
          design_issues: [],
          oem_compatibility: [
            { name: 'Prusa i3 MK3', score: Math.floor(Math.random() * 30) + 70 },
            { name: 'Ender 3 Pro', score: Math.floor(Math.random() * 30) + 70 },
            { name: 'Ultimaker S3', score: Math.floor(Math.random() * 30) + 70 }
          ]
        }

        // Update FormIQ job status
        await supabaseClient
          .from('formiq_jobs')
          .update({
            job_status: 'completed',
            result_data: simulatedAnalysis,
            completed_at: new Date().toISOString()
          })
          .eq('model_id', modelId)

        // Create analysis record
        await supabaseClient
          .from('formiq_analyses')
          .insert({
            model_id: modelId,
            ...simulatedAnalysis
          })

        // Update model with analysis results
        await supabaseClient
          .from('models')
          .update({
            printability_score: simulatedAnalysis.printability_score,
            material_recommendations: simulatedAnalysis.material_recommendations,
            printing_techniques: simulatedAnalysis.printing_techniques,
            design_issues: simulatedAnalysis.design_issues,
            oem_compatibility: simulatedAnalysis.oem_compatibility,
            processing_status: 'completed'
          })
          .eq('id', modelId)

        return new Response(JSON.stringify({
          success: true,
          analysis: simulatedAnalysis
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Real FormIQ API call would go here
      const formiqResponse = await fetch(`${formiqApiUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${formiqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file_url: fileUrl,
          analysis_type: 'comprehensive'
        })
      })

      if (!formiqResponse.ok) {
        throw new Error('FormIQ API call failed')
      }

      const analysisResult = await formiqResponse.json()

      // Process and store results
      await supabaseClient
        .from('formiq_jobs')
        .update({
          job_status: 'completed',
          result_data: analysisResult,
          completed_at: new Date().toISOString()
        })
        .eq('model_id', modelId)

      await supabaseClient
        .from('formiq_analyses')
        .insert({
          model_id: modelId,
          ...analysisResult
        })

      await supabaseClient
        .from('models')
        .update({
          printability_score: analysisResult.printability_score,
          material_recommendations: analysisResult.material_recommendations,
          printing_techniques: analysisResult.printing_techniques,
          design_issues: analysisResult.design_issues,
          oem_compatibility: analysisResult.oem_compatibility,
          processing_status: 'completed'
        })
        .eq('id', modelId)

      return new Response(JSON.stringify({
        success: true,
        analysis: analysisResult
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response('Invalid action', {
      status: 400,
      headers: corsHeaders
    })

  } catch (error) {
    console.error('FormIQ integration error:', error)
    return new Response('FormIQ integration failed', {
      status: 500,
      headers: corsHeaders
    })
  }
})
