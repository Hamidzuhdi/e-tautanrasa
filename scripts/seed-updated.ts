// Update script seed.ts path since we moved lib folder
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@tautanrasa.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@tautanrasa.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create categories
  const categories = [
    {
      name: 'Charm Series',
      description: 'Koleksi elegan dengan sentuhan mempesona',
    },
    {
      name: 'Taut Series', 
      description: 'Rangkaian fashion yang terhubung harmonis',
    },
    {
      name: 'Drawstring Collection',
      description: 'Kenyamanan bertemu dengan gaya modern',
    }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category
    })
  }

  console.log('✅ Categories created')

  // Create sample products
  const charmCategory = await prisma.category.findUnique({ where: { name: 'Charm Series' } })
  const tautCategory = await prisma.category.findUnique({ where: { name: 'Taut Series' } })
  const drawstringCategory = await prisma.category.findUnique({ where: { name: 'Drawstring Collection' } })

  if (charmCategory) {
    await prisma.product.upsert({
      where: { slug: 'ballerina-grace' },
      update: {},
      create: {
        name: 'Tautan Rasa Charm Era - Ballerina Grace',
        slug: 'ballerina-grace',
        description: 'Gelang charm dengan bunga asli dan resin berkualitas tinggi',
        price: 177000,
        stock: 10,
        categoryId: charmCategory.id,
        images: ['/uploads/products/ballerina-grace.jpg']
      }
    })

    await prisma.product.upsert({
      where: { slug: 'ocean-bloom' },
      update: {},
      create: {
        name: 'Tautan Rasa Charm Era - Ocean Bloom',
        slug: 'ocean-bloom',
        description: 'Gelang charm dengan motif bunga laut yang elegan',
        price: 187000,
        stock: 8,
        categoryId: charmCategory.id,
        images: ['/uploads/products/ocean-bloom.jpg']
      }
    })
  }

  if (tautCategory) {
    await prisma.product.upsert({
      where: { slug: 'gentle-rose' },
      update: {},
      create: {
        name: 'Tautan Rasa Taut - Gentle Rose',
        slug: 'gentle-rose',
        description: 'Gelang taut dengan rose lembut yang mempesona',
        price: 177000,
        stock: 12,
        categoryId: tautCategory.id,
        images: ['/uploads/products/gentle-rose.jpg']
      }
    })
  }

  if (drawstringCategory) {
    await prisma.product.upsert({
      where: { slug: 'pinkies-bumb' },
      update: {},
      create: {
        name: 'Tautan Rasa - Pinkies Bumb',
        slug: 'pinkies-bumb',
        description: 'Tas drawstring dengan aksen pink yang manis',
        price: 185000,
        stock: 5,
        categoryId: drawstringCategory.id,
        images: ['/uploads/products/pinkies-bumb.jpg']
      }
    })
  }

  console.log('✅ Sample products created')
  console.log('🎉 Seeding completed!')
  console.log('')
  console.log('Admin Login:')
  console.log('Email: admin@tautanrasa.com')
  console.log('Password: admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })