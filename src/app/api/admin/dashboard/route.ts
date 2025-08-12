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

    // Obtener estadísticas
    const [totalOrders, totalProducts, totalUsers, recentOrders] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true }
          }
        }
      })
    ]);

    // Calcular ingresos totales
    const completedOrders = await prisma.order.findMany({
      where: { paymentStatus: 'COMPLETED' }
    });
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);

    return NextResponse.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      recentOrders
    });

  } catch (error) {
    console.error('Error en dashboard:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
