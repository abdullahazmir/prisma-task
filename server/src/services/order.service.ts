import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { OrderStatus } from '@prisma/client';

export class OrderService {
  static async createOrder(
    userId: string,
    payload: { items: { productId: string; quantity: number }[] }
  ) {
    if (!payload.items || payload.items.length === 0) {
      throw new AppError(400, 'Order must contain at least one item!');
    }

    const productIds = payload.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isDeleted: false,
      },
    });

    if (products.length !== productIds.length) {
      throw new AppError(400, 'One or more products are invalid or no longer available!');
    }

    let totalAmount = 0;
    const orderItemsData = payload.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const price = product.price;
      totalAmount += price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price,
      };
    });

    const newOrder = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: OrderStatus.PENDING,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return newOrder;
  }

  static async getOrders(user: { id: string; role: string }) {
    const whereConditions: any = { isDeleted: false };

    if (user.role !== 'ADMIN') {
      whereConditions.userId = user.id;
    }

    return await prisma.order.findMany({
      where: whereConditions,
      include: {
        user: { select: { id: true, name: true, email: true } },
        orderItems: {
          include: {
            product: { select: { id: true, name: true, price: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getOrderById(id: string, user: { id: string; role: string }) {
    const order = await prisma.order.findFirst({
      where: { id, isDeleted: false },
      include: {
        user: { select: { id: true, name: true, email: true } },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError(404, 'Order not found!');
    }

    if (user.role !== 'ADMIN' && order.userId !== user.id) {
      throw new AppError(403, 'Forbidden! You cannot view another customer\'s order.');
    }

    return order;
  }

  static async updateOrderStatus(id: string, status: OrderStatus) {
    const order = await prisma.order.findFirst({
      where: { id, isDeleted: false },
    });

    if (!order) {
      throw new AppError(404, 'Order not found!');
    }

    return await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        orderItems: { include: { product: true } },
      },
    });
  }

  static async softDeleteOrder(id: string) {
    const order = await prisma.order.findFirst({
      where: { id, isDeleted: false },
    });

    if (!order) {
      throw new AppError(404, 'Order not found!');
    }

    await prisma.order.update({
      where: { id },
      data: { isDeleted: true },
    });

    return { message: 'Order deleted successfully (soft delete)' };
  }
}
