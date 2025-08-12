import { prisma } from './db'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  longDescription?: string
  images?: string[]
  specifications?: Record<string, string>
  features?: string[]
  category?: string
  brand?: string
  inStock?: boolean
  stock?: number
}

export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { inStock: true }
  })
  
  return products.map(product => ({
    ...product,
    image: JSON.parse(product.images)[0] || '',
    images: JSON.parse(product.images),
    longDescription: product.description,
    specifications: {},
    features: []
  }))
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id }
  })
  
  if (!product) return null
  
  return {
    ...product,
    image: JSON.parse(product.images)[0] || '',
    images: JSON.parse(product.images),
    longDescription: product.description,
    specifications: {},
    features: []
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { 
      category,
      inStock: true 
    }
  })
  
  return products.map(product => ({
    ...product,
    image: JSON.parse(product.images)[0] || '',
    images: JSON.parse(product.images),
    longDescription: product.description,
    specifications: {},
    features: []
  }))
}

export async function searchProducts(query: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: {
      inStock: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } }
      ]
    }
  })
  
  return products.map(product => ({
    ...product,
    image: JSON.parse(product.images)[0] || '',
    images: JSON.parse(product.images),
    longDescription: product.description,
    specifications: {},
    features: []
  }))
}
