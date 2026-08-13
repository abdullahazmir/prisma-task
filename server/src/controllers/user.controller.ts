import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { sendResponse } from '../utils/sendResponse';

export class UserController {
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.getAllUsers(req.query);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Users retrieved successfully!',
        data: result.users,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.getUserById(req.params.id);
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

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.updateUser(req.params.id, req.body);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User updated successfully!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.softDeleteUser(req.params.id);
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
