import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authGuard } from '../middlewares/authGuard';
import { roleGuard } from '../middlewares/roleGuard';

const router = Router();

router.post('/', authGuard, roleGuard('ADMIN'), CategoryController.createCategory);
router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);
router.patch('/:id', authGuard, roleGuard('ADMIN'), CategoryController.updateCategory);
router.delete('/:id', authGuard, roleGuard('ADMIN'), CategoryController.deleteCategory);

export const categoryRoutes = router;
