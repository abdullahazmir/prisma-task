import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authGuard } from '../middlewares/authGuard';
import { roleGuard } from '../middlewares/roleGuard';

const router = Router();

router.post('/', authGuard, roleGuard('ADMIN'), ProductController.createProduct);
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
router.patch('/:id', authGuard, roleGuard('ADMIN'), ProductController.updateProduct);
router.delete('/:id', authGuard, roleGuard('ADMIN'), ProductController.deleteProduct);

export const productRoutes = router;
