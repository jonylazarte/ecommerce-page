import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword, createSession } from '@/lib/auth'
import { loginSchema, sanitizeEmail } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada
    const validatedData = loginSchema.parse(body)
    
    // Sanitizar email
    const email = sanitizeEmail(validatedData.email)
    
    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }
    
    // Verificar contraseña
    const isValidPassword = await verifyPassword(validatedData.password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }
    
    // Crear sesión
    const token = await createSession(user.id)
    
    // Retornar respuesta sin contraseña
    const { password, ...userWithoutPassword } = user
    
    return NextResponse.json({
      user: userWithoutPassword,
      token
    })
    
  } catch (error) {
    console.error('Error en login:', error)
    
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
