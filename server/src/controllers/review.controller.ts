import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';
import { sendResponse } from '../utils/sendResponse';

export class ReviewController {
  static async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await ReviewService.createReview(userId, req.body);
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Review submitted successfully!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ReviewService.getAllReviews(req.query);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Reviews retrieved successfully!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getReviewById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ReviewService.getReviewById(req.params.id);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Review retrieved successfully!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ReviewService.updateReview(req.params.id, req.user!, req.body);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Review updated successfully!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ReviewService.softDeleteReview(req.params.id, req.user!);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
