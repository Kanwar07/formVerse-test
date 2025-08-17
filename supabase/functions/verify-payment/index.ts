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
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { payment_id, provider } = await req.json();

    if (!payment_id || !provider) {
      return new Response(
        JSON.stringify({ error: 'Payment ID and provider required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    let verified = false;

    if (provider === 'razorpay') {
      // Verify Razorpay payment signature
      const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
      if (!razorpayKeySecret) {
        throw new Error('Razorpay key secret not configured');
      }

      try {
        // Get payment details from Razorpay API
        const razorpayAuth = btoa(`${Deno.env.get('RAZORPAY_KEY_ID')}:${razorpayKeySecret}`);
        const razorpayResponse = await fetch(`https://api.razorpay.com/v1/payments/${payment_id}`, {
          headers: {
            'Authorization': `Basic ${razorpayAuth}`,
            'Content-Type': 'application/json'
          }
        });

        if (razorpayResponse.ok) {
          const paymentData = await razorpayResponse.json();
          verified = paymentData.status === 'captured';
        }
      } catch (error) {
        console.error('Razorpay verification error:', error);
      }
    } 
    
    else if (provider === 'paypal') {
      // Verify PayPal payment
      const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
      const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
      
      if (!paypalClientId || !paypalClientSecret) {
        throw new Error('PayPal credentials not configured');
      }

      try {
        // Get PayPal access token
        const auth = btoa(`${paypalClientId}:${paypalClientSecret}`);
        const tokenResponse = await fetch('https://api.paypal.com/v1/oauth2/token', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: 'grant_type=client_credentials'
        });

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          
          // Verify payment details
          const paymentResponse = await fetch(`https://api.paypal.com/v2/checkout/orders/${payment_id}`, {
            headers: {
              'Authorization': `Bearer ${tokenData.access_token}`,
              'Content-Type': 'application/json'
            }
          });

          if (paymentResponse.ok) {
            const paymentData = await paymentResponse.json();
            verified = paymentData.status === 'COMPLETED';
          }
        }
      } catch (error) {
        console.error('PayPal verification error:', error);
      }
    }

    return new Response(
      JSON.stringify({ verified }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Payment verification error:', error);
    return new Response(
      JSON.stringify({ error: 'Payment verification failed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});