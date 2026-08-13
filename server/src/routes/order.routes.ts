import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authGuard } from '../middlewares/authGuard';
import { roleGuard } from '../middlewares/roleGuard';

const router = Router();

router.post('/', authGuard, OrderController.createOrder);
router.get('/', authGuard, OrderController.getOrders);
router.get('/:id', authGuard, OrderController.getOrderById);
router.patch('/:id/status', authGuard, roleGuard('ADMIN'), OrderController.updateOrderStatus);
router.delete('/:id', authGuard, roleGuard('ADMIN'), OrderController.deleteOrder);

export const orderRoutes = router;
