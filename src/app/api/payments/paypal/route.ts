import { NextRequest, NextResponse } from 'next/server';

// Función para obtener el token de acceso de PayPal
async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

// Función para verificar el pago con PayPal
async function verifyPayPalPayment(paymentId: string) {
  const accessToken = await getPayPalAccessToken();
  
  const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${paymentId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, amount, currency, items, customerInfo } = body;

    console.log('Verificando pago con PayPal:', { paymentId, amount, currency, items, customerInfo });

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: 'ID de pago requerido' },
        { status: 400 }
      );
    }

    // Verificar el pago con PayPal
    const paypalOrder = await verifyPayPalPayment(paymentId);

    if (paypalOrder.status === 'COMPLETED') {
      // Crear orden en la base de datos
      const orderId = `paypal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return NextResponse.json({
        success: true,
        orderId: orderId,
        paymentId: paymentId,
        paypalOrderId: paypalOrder.id,
        message: 'Pago verificado y procesado exitosamente'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'El pago no fue completado en PayPal' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error en PayPal API:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}


