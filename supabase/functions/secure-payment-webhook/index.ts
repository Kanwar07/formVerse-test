import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.text();
    const webhookData = JSON.parse(body);
    
    let paymentId: string | null = null;
    let isValidWebhook = false;

    // Verify webhook authenticity and extract payment ID
    if (webhookData.entity === 'payment' && webhookData.event === 'payment.captured') {
      // Razorpay webhook
      const razorpaySignature = req.headers.get('x-razorpay-signature');
      const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');
      
      if (razorpaySignature && webhookSecret) {
        // Verify Razorpay webhook signature
        const expectedSignature = await crypto.subtle
          .importKey(
            'raw',
            new TextEncoder().encode(webhookSecret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
          )
          .then(key => crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body)))
          .then(signature => Array.from(new Uint8Array(signature))
            .map(b => b.toString(16).padStart(2, '0')).join(''));

        if (razorpaySignature === expectedSignature) {
          isValidWebhook = true;
          paymentId = webhookData.payload?.payment?.entity?.id;
        }
      }
    }
    
    else if (webhookData.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      // PayPal webhook
      const paypalSignature = req.headers.get('paypal-auth-algo');
      const paypalCertId = req.headers.get('paypal-cert-id');
      
      // For production, implement full PayPal webhook signature verification
      // For now, we'll do basic validation
      if (paypalSignature && paypalCertId) {
        isValidWebhook = true;
        paymentId = webhookData.resource?.id;
      }
    }

    if (!isValidWebhook || !paymentId) {
      return new Response(
        JSON.stringify({ error: 'Invalid webhook or missing payment ID' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Find the transaction by payment_id
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .select('*')
      .eq('payment_id', paymentId)
      .eq('status', 'pending')
      .single();

    if (transactionError || !transaction) {
      console.error('Transaction not found:', transactionError);
      return new Response(
        JSON.stringify({ error: 'Transaction not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Update transaction status
    const { error: updateError } = await supabase
      .from('transactions')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', transaction.id);

    if (updateError) {
      throw updateError;
    }

    // Create user license
    const { data: licenseType } = await supabase
      .from('license_types')
      .select('is_exclusive')
      .eq('id', transaction.license_type_id)
      .single();

    // If exclusive license, revoke existing licenses
    if (licenseType?.is_exclusive) {
      const { error: revokeError } = await supabase.rpc('revoke_existing_licenses', {
        target_model_id: transaction.model_id
      });
      
      if (revokeError) {
        console.error('Error revoking existing licenses:', revokeError);
      }
    }

    // Create the new license
    const { error: licenseError } = await supabase
      .from('user_licenses')
      .insert({
        user_id: transaction.user_id,
        model_id: transaction.model_id,
        license_type_id: transaction.license_type_id,
        transaction_id: transaction.id,
        purchased_at: new Date().toISOString()
      });

    if (licenseError) {
      throw licenseError;
    }

    console.log(`Payment webhook processed successfully for payment ${paymentId}`);
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});