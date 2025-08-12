import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Crear usuario administrador
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@redchilli.com' },
    update: {},
    create: {
      email: 'admin@redchilli.com',
      name: 'Administrador',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2.', // password: admin123
      role: 'ADMIN',
    },
  })

  // Crear productos de ejemplo
  const products = [
    {
      name: 'Drone DJI Mini 3 Pro',
      description: 'Drone profesional con cámara 4K, perfecto para fotografía aérea y videografía.',
      price: 899.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=500',
        'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=500'
      ]),
      category: 'drones',
      brand: 'DJI',
      inStock: true,
      stock: 10
    },
    {
      name: 'Smartphone Xiaomi 13 Pro',
      description: 'Smartphone de alta gama con cámara Leica y procesador Snapdragon 8 Gen 2.',
      price: 1299.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'
      ]),
      category: 'smartphones',
      brand: 'Xiaomi',
      inStock: true,
      stock: 15
    },
    {
      name: 'Auriculares Sony WH-1000XM5',
      description: 'Auriculares inalámbricos con cancelación de ruido líder en la industria.',
      price: 399.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
      ]),
      category: 'auriculares',
      brand: 'Sony',
      inStock: true,
      stock: 20
    },
    {
      name: 'Cámara Canon EOS R6',
      description: 'Cámara mirrorless profesional con sensor full-frame y estabilización de imagen.',
      price: 2499.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
        'https://images.unsplash.com/photo-1510127034890-ba275aee712a?w=500'
      ]),
      category: 'camaras',
      brand: 'Canon',
      inStock: true,
      stock: 8
    },
    {
      name: 'Tablet Samsung Galaxy Tab S9',
      description: 'Tablet premium con pantalla AMOLED y S Pen incluido.',
      price: 799.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500'
      ]),
      category: 'tablets',
      brand: 'Samsung',
      inStock: true,
      stock: 12
    },
    {
      name: 'Smartwatch Apple Watch Series 9',
      description: 'Reloj inteligente con monitor cardíaco y GPS integrado.',
      price: 399.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        'https://images.unsplash.com/photo-1434493789847-2f02dc6ca359?w=500'
      ]),
      category: 'wearables',
      brand: 'Apple',
      inStock: true,
      stock: 25
    }
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  console.log('Base de datos poblada con datos de ejemplo')
  console.log('Usuario admin creado: admin@redchilli.com / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
