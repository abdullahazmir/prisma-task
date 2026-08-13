import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { sendResponse } from '../utils/sendResponse';

export class CategoryController {
  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CategoryService.createCategory(req.body);
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Category created successfully!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CategoryService.getAllCategories();
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Categories retrieved successfully!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CategoryService.getCategoryById(req.params.id);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Category retrieved successfully!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CategoryService.updateCategory(req.params.id, req.body);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Category updated successfully!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CategoryService.softDeleteCategory(req.params.id);
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
