import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import { prisma } from '../../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Iniciando guardado de configuración...');
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ Token no encontrado');
      return NextResponse.json({ error: 'Token requerido' }, { status: 401 });
    }

    console.log('🔍 Verificando token...');
    const payload = verifyToken(token);
    if (!payload) {
      console.log('❌ Token inválido');
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    console.log('👤 Payload del token:', payload);
    
    if (payload.role !== 'ADMIN') {
      console.log('❌ Usuario no autorizado, rol:', payload.role);
      return NextResponse.json({ error: 'Acceso denegado - Se requieren permisos de administrador' }, { status: 403 });
    }

    console.log('📥 Parseando datos de configuración...');
    const settings = await request.json();
    console.log('📋 Configuración recibida:', JSON.stringify(settings, null, 2));

    // Validaciones básicas - permitir campos vacíos para configuración gradual
    if (!settings.stripe) {
      return NextResponse.json({ error: 'Configuración de Stripe requerida' }, { status: 400 });
    }

    if (!settings.paypal) {
      return NextResponse.json({ error: 'Configuración de PayPal requerida' }, { status: 400 });
    }

    if (!settings.email) {
      return NextResponse.json({ error: 'Configuración de email requerida' }, { status: 400 });
    }

    if (!settings.bank) {
      return NextResponse.json({ error: 'Configuración bancaria requerida' }, { status: 400 });
    }

    console.log('💾 Guardando configuración en la base de datos...');
    
    // Guardar cada sección de configuración en la base de datos
    const configSections = [
      { key: 'stripe', value: JSON.stringify(settings.stripe) },
      { key: 'paypal', value: JSON.stringify(settings.paypal) },
      { key: 'email', value: JSON.stringify(settings.email) },
      { key: 'bank', value: JSON.stringify(settings.bank) }
    ];

    for (const section of configSections) {
      console.log(`💾 Guardando sección: ${section.key}`);
      await prisma.settings.upsert({
        where: { key: section.key },
        update: { value: section.value },
        create: { key: section.key, value: section.value }
      });
      console.log(`✅ Sección ${section.key} guardada`);
    }

    console.log('🎉 Configuración guardada exitosamente en la base de datos');

    return NextResponse.json({ message: 'Configuración guardada exitosamente' });

  } catch (error) {
    console.error('Error guardando configuración:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    if (payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado - Se requieren permisos de administrador' }, { status: 403 });
    }

    // Obtener todas las configuraciones
    const settings = await prisma.settings.findMany();
    
    const config: any = {};
    settings.forEach(setting => {
      config[setting.key] = JSON.parse(setting.value);
    });

    return NextResponse.json(config);

  } catch (error) {
    console.error('Error obteniendo configuración:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
