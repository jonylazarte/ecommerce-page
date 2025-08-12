import { prisma } from './db';
import { hashPassword } from './auth';

async function createAdmin() {
  try {
    // Verificar si ya existe un admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      console.log('Ya existe un usuario administrador');
      return;
    }

    // Crear usuario admin
    const hashedPassword = await hashPassword('admin123');
    
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@redchilli.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('Usuario administrador creado exitosamente:');
    console.log('Email: admin@redchilli.com');
    console.log('Contraseña: admin123');
    console.log('ID:', admin.id);

  } catch (error) {
    console.error('Error creando admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
