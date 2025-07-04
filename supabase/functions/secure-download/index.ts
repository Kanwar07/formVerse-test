
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

    const url = new URL(req.url)
    const token = url.pathname.split('/').pop()

    if (!token) {
      return new Response('Invalid download token', { 
        status: 400, 
        headers: corsHeaders 
      })
    }

    // Validate download token
    const { data: downloadRecord, error: downloadError } = await supabaseClient
      .from('model_downloads')
      .select(`
        *,
        user_licenses!inner(
          is_revoked,
          expires_at,
          model_id
        ),
        models!inner(
          file_path,
          name,
          user_id
        )
      `)
      .eq('download_token', token)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (downloadError || !downloadRecord) {
      return new Response('Invalid or expired download token', { 
        status: 403, 
        headers: corsHeaders 
      })
    }

    // Check if license is still valid
    if (downloadRecord.user_licenses.is_revoked) {
      return new Response('License has been revoked', { 
        status: 403, 
        headers: corsHeaders 
      })
    }

    if (downloadRecord.user_licenses.expires_at && 
        new Date(downloadRecord.user_licenses.expires_at) < new Date()) {
      return new Response('License has expired', { 
        status: 403, 
        headers: corsHeaders 
      })
    }

    // Get signed URL for file download
    const { data: signedUrl, error: signedUrlError } = await supabaseClient.storage
      .from('3d-models')
      .createSignedUrl(downloadRecord.models.file_path, 3600) // 1 hour expiry

    if (signedUrlError || !signedUrl) {
      return new Response('Failed to generate download URL', { 
        status: 500, 
        headers: corsHeaders 
      })
    }

    // Update download count
    await supabaseClient
      .from('user_licenses')
      .update({ 
        download_count: downloadRecord.user_licenses.download_count + 1 
      })
      .eq('id', downloadRecord.license_id)

    // Log analytics
    await supabaseClient
      .from('model_analytics')
      .insert({
        model_id: downloadRecord.user_licenses.model_id,
        event_type: 'download',
        user_id: downloadRecord.user_id,
        metadata: {
          download_token: token,
          ip_address: req.headers.get('x-forwarded-for'),
          user_agent: req.headers.get('user-agent')
        }
      })

    // Redirect to signed URL
    return Response.redirect(signedUrl.signedUrl, 302)

  } catch (error) {
    console.error('Secure download error:', error)
    return new Response('Internal server error', { 
      status: 500, 
      headers: corsHeaders 
    })
  }
})
