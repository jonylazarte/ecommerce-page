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
  try {
    const products = await prisma.product.findMany({
      where: { inStock: true }
    })
    
    return products.map(product => {
      // Parse images safely
      let images: string[] = []
      try {
        images = JSON.parse(product.images)
      } catch (error) {
        console.error('Error parsing product images:', error)
        images = [product.images] // Fallback to single image
      }
      
      return {
        ...product,
        image: images[0] || '',
        images: images,
        longDescription: product.description,
        specifications: {},
        features: [],
        inStock: product.inStock ?? true,
        brand: product.brand || 'Marca',
        category: product.category || 'Categoría'
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    })
    
    if (!product) return null
    
    // Parse images safely
    let images: string[] = []
    try {
      images = JSON.parse(product.images)
    } catch (error) {
      console.error('Error parsing product images:', error)
      images = [product.images] // Fallback to single image
    }
    
    return {
      ...product,
      image: images[0] || '',
      images: images,
      longDescription: product.description,
      specifications: {},
      features: [],
      inStock: product.inStock ?? true,
      brand: product.brand || 'Marca',
      category: product.category || 'Categoría'
    }
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    return null
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { 
        category,
        inStock: true 
      }
    })
    
    return products.map(product => {
      // Parse images safely
      let images: string[] = []
      try {
        images = JSON.parse(product.images)
      } catch (error) {
        console.error('Error parsing product images:', error)
        images = [product.images] // Fallback to single image
      }
      
      return {
        ...product,
        image: images[0] || '',
        images: images,
        longDescription: product.description,
        specifications: {},
        features: [],
        inStock: product.inStock ?? true,
        brand: product.brand || 'Marca',
        category: product.category || 'Categoría'
      }
    })
  } catch (error) {
    console.error('Error fetching products by category:', error)
    return []
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        inStock: true,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { category: { contains: query } },
          { brand: { contains: query } }
        ]
      }
    })
    
    return products.map(product => {
      // Parse images safely
      let images: string[] = []
      try {
        images = JSON.parse(product.images)
      } catch (error) {
        console.error('Error parsing product images:', error)
        images = [product.images] // Fallback to single image
      }
      
      return {
        ...product,
        image: images[0] || '',
        images: images,
        longDescription: product.description,
        specifications: {},
        features: [],
        inStock: product.inStock ?? true,
        brand: product.brand || 'Marca',
        category: product.category || 'Categoría'
      }
    })
  } catch (error) {
    console.error('Error searching products:', error)
    return []
  }
}
