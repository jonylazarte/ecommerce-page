import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simular procesamiento de webhook
    console.log('MercadoPago webhook received:', body);
    
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error processing MercadoPago webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Error al procesar webhook' },
      { status: 500 }
    );
  }
}
