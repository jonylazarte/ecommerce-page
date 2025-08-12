import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { validateSession } from '@/lib/auth'
import { orderSchema, validatePrice, validateQuantity } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada
    const validatedData = orderSchema.parse(body)
    
    // Obtener token del header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7)
    const user = await validateSession(token)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Sesión inválida' },
        { status: 401 }
      )
    }
    
    // Validar productos y calcular total
    let total = 0
    const orderItems = []
    
    for (const item of validatedData.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      })
      
      if (!product) {
        return NextResponse.json(
          { error: `Producto ${item.productId} no encontrado` },
          { status: 400 }
        )
      }
      
      if (!product.inStock || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para ${product.name}` },
          { status: 400 }
        )
      }
      
      if (!validateQuantity(item.quantity)) {
        return NextResponse.json(
          { error: 'Cantidad inválida' },
          { status: 400 }
        )
      }
      
      if (!validatePrice(product.price)) {
        return NextResponse.json(
          { error: 'Precio inválido' },
          { status: 400 }
        )
      }
      
      total += product.price * item.quantity
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      })
    }
    
    // Crear pedido
    const order = await prisma.order.create({
      data: {
        userId: user.userId,
        total,
        shippingAddress: validatedData.shippingAddress,
        billingAddress: validatedData.billingAddress,
        paymentMethod: validatedData.paymentMethod,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })
    
    // Actualizar stock de productos
    for (const item of validatedData.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    }
    
    return NextResponse.json(order)
    
  } catch (error) {
    console.error('Error al crear pedido:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Obtener token del header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7)
    const user = await validateSession(token)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Sesión inválida' },
        { status: 401 }
      )
    }
    
    // Obtener pedidos del usuario
    const orders = await prisma.order.findMany({
      where: { userId: user.userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(orders)
    
  } catch (error) {
    console.error('Error al obtener pedidos:', error)
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
