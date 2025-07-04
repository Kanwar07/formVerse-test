
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

    const { provider, payload } = await req.json()

    if (provider === 'razorpay') {
      // Handle Razorpay webhook
      const { event, payload: razorpayPayload } = payload
      
      if (event === 'payment.captured') {
        const paymentId = razorpayPayload.payment.entity.id
        
        // Find transaction by payment ID
        const { data: transaction, error } = await supabaseClient
          .from('transactions')
          .select('*')
          .eq('payment_id', paymentId)
          .single()

        if (error || !transaction) {
          console.error('Transaction not found:', paymentId)
          return new Response('Transaction not found', { status: 404 })
        }

        // Update transaction status
        await supabaseClient
          .from('transactions')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', transaction.id)

        // Create user license
        await supabaseClient
          .from('user_licenses')
          .insert({
            user_id: transaction.user_id,
            model_id: transaction.model_id,
            license_type_id: transaction.license_type_id,
            transaction_id: transaction.id
          })

        // Check for exclusive license and revoke others if needed
        const { data: licenseType } = await supabaseClient
          .from('license_types')
          .select('is_exclusive')
          .eq('id', transaction.license_type_id)
          .single()

        if (licenseType?.is_exclusive) {
          await supabaseClient.rpc('revoke_existing_licenses', {
            target_model_id: transaction.model_id
          })
        }
      }
    } else if (provider === 'paypal') {
      // Handle PayPal webhook
      const { event_type, resource } = payload
      
      if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
        const paymentId = resource.id
        
        // Similar processing for PayPal
        const { data: transaction } = await supabaseClient
          .from('transactions')
          .select('*')
          .eq('payment_id', paymentId)
          .single()

        if (transaction) {
          // Process transaction completion
          await supabaseClient
            .from('transactions')
            .update({
              status: 'completed',
              completed_at: new Date().toISOString()
            })
            .eq('id', transaction.id)

          // Create license and handle exclusivity
          // ... similar logic as Razorpay
        }
      }
    }

    return new Response('Webhook processed successfully', {
      headers: corsHeaders
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response('Webhook processing failed', {
      status: 500,
      headers: corsHeaders
    })
  }
})
