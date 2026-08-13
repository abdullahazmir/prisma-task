import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { sendResponse } from '../utils/sendResponse';

export class ProductController {
  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.createProduct(req.body);
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Product created successfully!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.getAllProducts(req.query);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Products retrieved successfully!',
        data: result.products,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.getProductById(req.params.id);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Product retrieved successfully!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.updateProduct(req.params.id, req.body);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Product updated successfully!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.softDeleteProduct(req.params.id);
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
