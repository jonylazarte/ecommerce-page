import { NextRequest, NextResponse } from 'next/server';
import mercadopago from 'mercadopago';

// Configurar MercadoPago
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN || ''
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verificar el tipo de notificación
    if (body.type === 'payment') {
      const paymentId = body.data.id;
      
      // Obtener información del pago
      const payment = await mercadopago.payment.findById(paymentId);
      
      if (payment.status === 'approved') {
        // Pago aprobado - actualizar orden en la base de datos
        console.log('Pago aprobado en MercadoPago:', paymentId);
        
        // Aquí puedes agregar lógica para actualizar la orden en tu base de datos
        // Por ejemplo, cambiar el estado de 'PENDING' a 'CONFIRMED'
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error processing MercadoPago webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}
