import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';

let stripe: Stripe | null = null;

// Solo inicializar Stripe si la API key está disponible
if (process.env.STRIPE_SECRET_KEY) {
  import('stripe').then((StripeModule) => {
    const Stripe = StripeModule.default;
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-07-30.basil',
    });
  });
}

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { success: false, error: 'Stripe no está configurado' },
        { status: 500 }
      );
    }

    const { amount, currency, paymentMethodId, customerEmail, customerName } = await request.json();

    console.log('Procesando pago con Stripe:', {
      amount,
      currency,
      customerEmail,
      customerName
    });

    // Crear el payment intent con Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Stripe espera el monto en centavos
      currency: currency.toLowerCase(),
      payment_method_types: ['card'],
      confirm: true,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
      metadata: {
        customer_email: customerEmail,
        customer_name: customerName
      }
    });

    if (paymentIntent.status === 'succeeded') {
      // Crear orden en la base de datos
      const orderId = `order_${Date.now()}`;
      
      console.log('Pago exitoso con Stripe:', paymentIntent.id);

      return NextResponse.json({
        success: true,
        paymentIntentId: paymentIntent.id,
        orderId: orderId,
        message: 'Pago procesado exitosamente'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'El pago no pudo ser procesado' },
        { status: 400 }
      );
    }

  } catch (error: unknown) {
    console.error('Error procesando pago con Stripe:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage
      },
      { status: 500 }
    );
  }
}
