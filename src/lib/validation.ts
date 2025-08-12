import { z } from 'zod'

// Esquemas de validación
export const userSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1, 'La cantidad debe ser al menos 1'),
  })).min(1, 'Debe tener al menos un producto'),
  shippingAddress: z.string().min(10, 'La dirección de envío es requerida'),
  billingAddress: z.string().min(10, 'La dirección de facturación es requerida'),
  paymentMethod: z.enum(['STRIPE', 'PAYPAL']),
})

export const paymentSchema = z.object({
  orderId: z.string(),
  paymentMethod: z.enum(['STRIPE', 'PAYPAL']),
  paymentData: z.object({}).passthrough(), // Datos específicos del método de pago
})

// Validación de CSRF
export function validateCSRF(token: string | null, sessionToken: string | null): boolean {
  // En producción, implementar validación real de CSRF
  // Por ahora, validación básica
  return Boolean(token && sessionToken && token.length > 0)
}

// Validación de rate limiting
export function validateRateLimit(ip: string, action: string): boolean {
  // En producción, implementar rate limiting real
  // Por ahora, retorna true
  return true
}

// Sanitización de datos
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remover < y >
    .trim()
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

// Validación de precio
export function validatePrice(price: number): boolean {
  return price > 0 && price < 1000000 // Máximo 1 millón
}

// Validación de cantidad
export function validateQuantity(quantity: number): boolean {
  return quantity > 0 && quantity <= 100 // Máximo 100 unidades
}
