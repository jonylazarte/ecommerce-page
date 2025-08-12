import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function createSession(userId: string): Promise<string> {
  // Obtener información completa del usuario
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true }
  })
  
  if (!user) {
    throw new Error('Usuario no encontrado')
  }
  
  const token = generateToken({ userId: user.id, email: user.email, role: user.role })
  
  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
  })
  
  return token
}

export async function validateSession(token: string): Promise<JWTPayload | null> {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  })
  
  if (!session || session.expiresAt < new Date()) {
    return null
  }
  
  return {
    userId: session.userId,
    email: session.user.email,
    role: session.user.role
  }
}

export async function deleteSession(token: string): Promise<void> {
  await prisma.session.delete({
    where: { token }
  })
}
