import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendResponse } from '../utils/sendResponse';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'User registered successfully!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User logged in successfully!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await AuthService.getMe(userId);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User profile retrieved successfully!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
