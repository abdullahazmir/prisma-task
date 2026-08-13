import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';

export class ReviewService {
  static async createReview(userId: string, payload: { productId: string; rating: number; comment?: string }) {
    const product = await prisma.product.findFirst({
      where: { id: payload.productId, isDeleted: false },
    });

    if (!product) {
      throw new AppError(404, 'Product not found!');
    }

    if (payload.rating < 1 || payload.rating > 5) {
      throw new AppError(400, 'Rating must be an integer between 1 and 5!');
    }

    return await prisma.review.create({
      data: {
        userId,
        productId: payload.productId,
        rating: payload.rating,
        comment: payload.comment,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true } },
      },
    });
  }

  static async getAllReviews(query: { productId?: string; userId?: string }) {
    const whereConditions: any = { isDeleted: false };
    if (query.productId) whereConditions.productId = query.productId;
    if (query.userId) whereConditions.userId = query.userId;

    return await prisma.review.findMany({
      where: whereConditions,
      include: {
        user: { select: { id: true, name: true } },
        product: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getReviewById(id: string) {
    const review = await prisma.review.findFirst({
      where: { id, isDeleted: false },
      include: {
        user: { select: { id: true, name: true } },
        product: { select: { id: true, name: true } },
      },
    });

    if (!review) {
      throw new AppError(404, 'Review not found!');
    }

    return review;
  }

  static async updateReview(
    reviewId: string,
    user: { id: string; role: string },
    payload: { rating?: number; comment?: string }
  ) {
    const review = await prisma.review.findFirst({
      where: { id: reviewId, isDeleted: false },
    });

    if (!review) {
      throw new AppError(404, 'Review not found!');
    }

    if (user.role !== 'ADMIN' && review.userId !== user.id) {
      throw new AppError(403, 'Forbidden! You can only edit your own reviews.');
    }

    return await prisma.review.update({
      where: { id: reviewId },
      data: payload,
    });
  }

  static async softDeleteReview(reviewId: string, user: { id: string; role: string }) {
    const review = await prisma.review.findFirst({
      where: { id: reviewId, isDeleted: false },
    });

    if (!review) {
      throw new AppError(404, 'Review not found!');
    }

    if (user.role !== 'ADMIN' && review.userId !== user.id) {
      throw new AppError(403, 'Forbidden! You can only delete your own reviews.');
    }

    await prisma.review.update({
      where: { id: reviewId },
      data: { isDeleted: true },
    });

    return { message: 'Review deleted successfully (soft delete)' };
  }
}
