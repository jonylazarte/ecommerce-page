import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { prisma } from '@/lib/db'
import { sendPaymentConfirmationEmail } from '@/lib/email'

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

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!stripe) {
    console.log('Stripe no está configurado, ignorando webhook');
    return NextResponse.json({ received: true });
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret)
  } catch (err) {
    console.error('Error verificando webhook:', err)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Obtener el pedido desde los metadatos
        const orderId = paymentIntent.metadata.orderId
        
        if (orderId) {
          // Obtener el pedido
          const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
              user: true,
              items: {
                include: {
                  product: true
                }
              }
            }
          })
          
          if (order && order.paymentStatus !== 'COMPLETED') {
            // Actualizar estado del pedido
            await prisma.order.update({
              where: { id: orderId },
              data: {
                paymentStatus: 'COMPLETED',
                stripePaymentIntentId: paymentIntent.id,
              },
            })
            
            // Enviar email de confirmación
            await sendPaymentConfirmationEmail({
              orderId: order.id,
              customerName: order.user.name,
              customerEmail: order.user.email,
              total: order.total,
              items: order.items.map(item => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.price,
              })),
              shippingAddress: order.shippingAddress,
            })
          }
        }
        break
        
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent
        const failedOrderId = failedPaymentIntent.metadata.orderId
        
        if (failedOrderId) {
          await prisma.order.update({
            where: { id: failedOrderId },
            data: {
              paymentStatus: 'FAILED',
            },
          })
        }
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
    
    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('Error procesando webhook:', error)
    return NextResponse.json(
      { error: 'Error procesando webhook' },
      { status: 500 }
    )
  }
}
