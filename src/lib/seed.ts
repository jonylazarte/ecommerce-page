import { prisma } from './db'

async function main() {
  // Limpiar la base de datos
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()
  await prisma.session.deleteMany()

  // Crear productos de ejemplo
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'DJI Mini 3 Pro Drone',
        description: 'Drone profesional con cámara 4K, estabilización de 3 ejes y hasta 34 minutos de vuelo',
        price: 4599000.00,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=500',
          'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=500'
        ]),
        category: 'Drones',
        brand: 'DJI',
        inStock: true,
        stock: 15
      }
    }),
    prisma.product.create({
      data: {
        name: 'Xiaomi Redmi Note 12 Pro',
        description: 'Smartphone con pantalla AMOLED de 6.67", cámara de 108MP y procesador MediaTek Dimensity 1080',
        price: 1299000.00,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'
        ]),
        category: 'Smartphones',
        brand: 'Xiaomi',
        inStock: true,
        stock: 25
      }
    }),
    prisma.product.create({
      data: {
        name: 'Huawei MateBook D14',
        description: 'Laptop ultrabook con procesador AMD Ryzen 7, 16GB RAM y SSD de 512GB',
        price: 3299000.00,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
          'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500'
        ]),
        category: 'Laptops',
        brand: 'Huawei',
        inStock: true,
        stock: 8
      }
    }),
    prisma.product.create({
      data: {
        name: 'OnePlus Buds Pro 2',
        description: 'Auriculares inalámbricos con cancelación de ruido activa y hasta 39 horas de batería',
        price: 899000.00,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
          'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500'
        ]),
        category: 'Audio',
        brand: 'OnePlus',
        inStock: true,
        stock: 30
      }
    }),
    prisma.product.create({
      data: {
        name: 'DJI Osmo Pocket 3',
        description: 'Cámara estabilizada de bolsillo con sensor de 1 pulgada y pantalla táctil',
        price: 2499000.00,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500'
        ]),
        category: 'Cámaras',
        brand: 'DJI',
        inStock: true,
        stock: 12
      }
    }),
    prisma.product.create({
      data: {
        name: 'Xiaomi Mi Robot Vacuum',
        description: 'Robot aspirador inteligente con mapeo LIDAR y control por app',
        price: 1599000.00,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
        ]),
        category: 'Hogar Inteligente',
        brand: 'Xiaomi',
        inStock: true,
        stock: 18
      }
    })
  ])

  console.log('Base de datos poblada con éxito!')
  console.log('Productos creados:', products.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
