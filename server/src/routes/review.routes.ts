import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { authGuard } from '../middlewares/authGuard';

const router = Router();

router.post('/', authGuard, ReviewController.createReview);
router.get('/', ReviewController.getAllReviews);
router.get('/:id', ReviewController.getReviewById);
router.patch('/:id', authGuard, ReviewController.updateReview);
router.delete('/:id', authGuard, ReviewController.deleteReview);

export const reviewRoutes = router;
