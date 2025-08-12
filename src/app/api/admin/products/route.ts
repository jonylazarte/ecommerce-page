import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { verifyToken } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(products);

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, price, category, brand, inStock, image, images, features, specifications } = body;

    if (!name || !description || !price || !category || !brand || !image) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        brand,
        inStock: Boolean(inStock),
        image,
        images: images || [],
        features: features || [],
        specifications: specifications || {}
      }
    });

    return NextResponse.json(product, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

