import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, createSession } from '@/lib/auth'
import { userSchema, sanitizeEmail, sanitizeString } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada
    const validatedData = userSchema.parse(body)
    
    // Sanitizar datos
    const sanitizedData = {
      name: sanitizeString(validatedData.name),
      email: sanitizeEmail(validatedData.email),
      password: validatedData.password
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      )
    }
    
    // Hashear contraseña
    const hashedPassword = await hashPassword(sanitizedData.password)
    
    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name: sanitizedData.name,
        email: sanitizedData.email,
        password: hashedPassword,
      }
    })
    
    // Crear sesión
    const token = await createSession(user.id)
    
    // Retornar respuesta sin contraseña
    const { password, ...userWithoutPassword } = user
    
    return NextResponse.json({
      user: userWithoutPassword,
      token
    })
    
  } catch (error) {
    console.error('Error en registro:', error)
    
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
