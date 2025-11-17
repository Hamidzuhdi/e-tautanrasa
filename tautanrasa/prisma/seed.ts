import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  try {
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const demoUser = await prisma.user.create({
      data: {
        name: 'Admin Tautan Rasa',
        email: 'admin@tautanrasa.com',
        password: hashedPassword,
        role: 'admin',
      },
    });

    const hashedPassword2 = await bcrypt.hash('user123', 10);

    const secondUser = await prisma.user.create({
      data: {
        name: 'Manager Tautan Rasa',
        email: 'manager@tautanrasa.com',
        password: hashedPassword2,
        role: 'admin',
      },
    });

  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
