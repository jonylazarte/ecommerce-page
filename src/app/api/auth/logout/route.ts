import { NextRequest, NextResponse } from 'next/server'
import { deleteSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token requerido' },
        { status: 400 }
      )
    }
    
    // Eliminar sesión
    await deleteSession(token)
    
    return NextResponse.json({
      message: 'Sesión cerrada exitosamente'
    })
    
  } catch (error) {
    console.error('Error en logout:', error)
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
