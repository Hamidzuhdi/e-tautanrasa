// scripts/check-data.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('=== CHECKING DATABASE DATA ===\n');
    
    // Check categories
    console.log('Categories:');
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    
    categories.forEach(cat => {
      console.log(`- ${cat.name} (ID: ${cat.id}) - ${cat._count.products} products`);
    });
    
    console.log('\nProducts:');
    const products = await prisma.product.findMany({
      include: {
        category: true
      }
    });
    
    products.forEach(product => {
      console.log(`- ${product.name} (${product.category?.name || 'No Category'}) - Rp ${product.price} - Stock: ${product.stock}`);
    });
    
    console.log('\nUsers:');
    const users = await prisma.user.findMany();
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.role}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();