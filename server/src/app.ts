import express, { Application } from 'express';
import cors from 'cors';
import { authRoutes } from './routes/auth.routes';
import { userRoutes } from './routes/user.routes';
import { categoryRoutes } from './routes/category.routes';
import { productRoutes } from './routes/product.routes';
import { reviewRoutes } from './routes/review.routes';
import { orderRoutes } from './routes/order.routes';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';

const app: Application = express();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Status Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SCIC/EJP-13 Backend REST API is running healthy 🚀',
  });
});

// Modular REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);

// Error and Not Found Middlewares
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
