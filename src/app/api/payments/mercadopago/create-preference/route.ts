import { NextRequest, NextResponse } from 'next/server';
import mercadopago from 'mercadopago';

// Configurar MercadoPago
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN || ''
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Crear preferencia de pago
    const preference = {
      items: body.items,
      back_urls: body.back_urls,
      auto_return: body.auto_return,
      external_reference: body.external_reference,
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/mercadopago/webhook`,
      expires: true,
      expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
    };

    const response = await mercadopago.preferences.create(preference);

    return NextResponse.json({
      success: true,
      init_point: response.body.init_point,
      preference_id: response.body.id
    });

  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear preferencia de pago' },
      { status: 500 }
    );
  }
}
