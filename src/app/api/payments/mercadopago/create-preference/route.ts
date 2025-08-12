import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simular creación de preferencia de pago
    const preferenceId = `pref_${Date.now()}`;
    
    return NextResponse.json({
      success: true,
      init_point: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?preference_id=${preferenceId}`,
      preference_id: preferenceId
    });

  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear preferencia de pago' },
      { status: 500 }
    );
  }
}
