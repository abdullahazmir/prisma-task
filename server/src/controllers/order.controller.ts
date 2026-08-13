import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { sendResponse } from '../utils/sendResponse';

export class OrderController {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await OrderService.createOrder(userId, req.body);
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Order created successfully!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await OrderService.getOrders(req.user!);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Orders retrieved successfully!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await OrderService.getOrderById(req.params.id, req.user!);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Order retrieved successfully!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await OrderService.updateOrderStatus(req.params.id, req.body.status);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Order status updated successfully!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await OrderService.softDeleteOrder(req.params.id);
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
