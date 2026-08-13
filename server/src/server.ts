import app from './app';
import { prisma } from './lib/prisma';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('✅ Connected successfully to PostgreSQL database via Prisma ORM');

    app.listen(PORT, () => {
      console.log(`🚀 SCIC/EJP-13 Server listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();
