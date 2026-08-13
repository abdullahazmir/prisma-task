import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authGuard } from '../middlewares/authGuard';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', authGuard, AuthController.getMe);

export const authRoutes = router;
