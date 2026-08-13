import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authGuard } from '../middlewares/authGuard';
import { roleGuard } from '../middlewares/roleGuard';

const router = Router();

router.get('/', authGuard, roleGuard('ADMIN'), UserController.getAllUsers);
router.get('/:id', authGuard, UserController.getUserById);
router.patch('/:id', authGuard, UserController.updateUser);
router.delete('/:id', authGuard, roleGuard('ADMIN'), UserController.deleteUser);

export const userRoutes = router;
