import { PrismaClient, UserRole, ProductStatus, OrderStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Password Hashing
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  // 1. Create Users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@scic.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@scic.com',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@scic.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'user@scic.com',
      password: userPassword,
      role: UserRole.USER,
    },
  });

  console.log(`👤 Users seeded: Admin (${adminUser.email}), User (${regularUser.email})`);

  // 2. Create Categories
  const category1 = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Gadgets, smartphones, and accessories',
    },
  });

  const category2 = await prisma.category.upsert({
    where: { slug: 'audio' },
    update: {},
    create: {
      name: 'Audio Gear',
      slug: 'audio',
      description: 'Headphones, earbuds, and speakers',
    },
  });

  const category3 = await prisma.category.upsert({
    where: { slug: 'laptops' },
    update: {},
    create: {
      name: 'Laptops & Workstations',
      slug: 'laptops',
      description: 'High performance computing devices',
    },
  });

  console.log('📂 Categories seeded.');

  // 3. Create Products
  const product1 = await prisma.product.create({
    data: {
      name: 'Pro Wireless Headphones',
      description: 'Active noise cancelling wireless headphones with 30-hour battery life.',
      price: 199.99,
      stock: 45,
      status: ProductStatus.AVAILABLE,
      categoryId: category2.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'UltraBook Pro 15',
      description: '15-inch OLED display, M-Series Processor, 16GB RAM, 512GB SSD.',
      price: 1299.99,
      stock: 15,
      status: ProductStatus.AVAILABLE,
      categoryId: category3.id,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Smart Watch Series X',
      description: 'Fitness tracker, heart rate monitor, GPS, and OLED display.',
      price: 249.99,
      stock: 30,
      status: ProductStatus.AVAILABLE,
      categoryId: category1.id,
    },
  });

  console.log('📦 Products seeded.');

  // 4. Create Reviews
  await prisma.review.createMany({
    data: [
      {
        rating: 5,
        comment: 'Outstanding sound quality and super comfortable noise cancellation!',
        userId: regularUser.id,
        productId: product1.id,
      },
      {
        rating: 4,
        comment: 'Great laptop for software engineering and multitasking.',
        userId: regularUser.id,
        productId: product2.id,
      },
    ],
  });

  console.log('⭐ Reviews seeded.');

  // 5. Create Order
  await prisma.order.create({
    data: {
      userId: regularUser.id,
      totalAmount: 199.99,
      status: OrderStatus.DELIVERED,
      orderItems: {
        create: [
          {
            productId: product1.id,
            quantity: 1,
            price: 199.99,
          },
        ],
      },
    },
  });

  console.log('🛒 Sample Order seeded.');
  console.log('✅ Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
