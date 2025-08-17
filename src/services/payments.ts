
import { APIService } from './api';
import { supabase } from '@/integrations/supabase/client';

// Global type declarations are in src/types/global.d.ts

export interface PaymentProvider {
  initialize(): Promise<void>;
  createPayment(amount: number, currency: string, metadata: any): Promise<any>;
  verifyPayment(paymentId: string): Promise<boolean>;
}

// Razorpay Integration (for India)
export class RazorpayProvider implements PaymentProvider {
  private razorpay: any;

  async initialize() {
    // Load Razorpay script
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.head.appendChild(script);
      
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }
  }

  async createPayment(amount: number, currency: string, metadata: any) {
    await this.initialize();
    
    return new Promise((resolve, reject) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: currency,
        name: 'FormVerse',
        description: `License for ${metadata.modelName}`,
        image: '/lovable-uploads/9ce09c17-cfd4-43bc-a961-0bd805bee565.png',
        handler: function (response: any) {
          resolve({
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
            method: 'razorpay'
          });
        },
        prefill: {
          name: metadata.userName,
          email: metadata.userEmail,
        },
        theme: {
          color: '#6366f1'
        },
        modal: {
          ondismiss: function() {
            reject(new Error('Payment cancelled'));
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  }

  async verifyPayment(paymentId: string): Promise<boolean> {
    try {
      // Verify payment via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { 
          payment_id: paymentId, 
          provider: 'razorpay' 
        }
      });
      
      if (error) {
        console.error('Payment verification error:', error);
        return false;
      }
      
      return data?.verified === true;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  }
}

// PayPal Integration (for global)
export class PayPalProvider implements PaymentProvider {
  private paypal: any;

  async initialize() {
    if (!window.paypal) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=USD`;
      document.head.appendChild(script);
      
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }
  }

  async createPayment(amount: number, currency: string, metadata: any) {
    await this.initialize();
    
    return new Promise((resolve, reject) => {
      window.paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount.toString(),
                currency_code: currency
              },
              description: `License for ${metadata.modelName}`
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture();
          resolve({
            payment_id: order.id,
            order_id: data.orderID,
            method: 'paypal',
            details: order
          });
        },
        onError: (err: any) => {
          reject(err);
        },
        onCancel: () => {
          reject(new Error('Payment cancelled'));
        }
      }).render('#paypal-button-container');
    });
  }

  async verifyPayment(paymentId: string): Promise<boolean> {
    try {
      // Verify payment via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { 
          payment_id: paymentId, 
          provider: 'paypal' 
        }
      });
      
      if (error) {
        console.error('Payment verification error:', error);
        return false;
      }
      
      return data?.verified === true;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  }
}

// Payment Manager
export class PaymentManager {
  private providers: Map<string, PaymentProvider> = new Map();

  constructor() {
    this.providers.set('razorpay', new RazorpayProvider());
    this.providers.set('paypal', new PayPalProvider());
  }

  async processPayment(
    provider: string,
    modelId: string,
    licenseTypeId: string,
    amount: number,
    currency: string,
    metadata: any
  ) {
    const paymentProvider = this.providers.get(provider);
    if (!paymentProvider) {
      throw new Error(`Payment provider ${provider} not supported`);
    }

    try {
      // Create payment with provider
      const paymentData = await paymentProvider.createPayment(amount, currency, metadata);
      
      // Verify payment
      const isVerified = await paymentProvider.verifyPayment(paymentData.payment_id);
      if (!isVerified) {
        throw new Error('Payment verification failed');
      }

      // Create transaction in database
      const transaction = await APIService.purchaseLicense(modelId, licenseTypeId, paymentData);
      
      // Confirm transaction
      const result = await APIService.confirmTransaction(transaction.id);
      
      return result;
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }
}
