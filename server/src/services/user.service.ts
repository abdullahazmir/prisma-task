import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { UserRole } from '@prisma/client';
import { hashPassword } from '../utils/password';

export class UserService {
  static async getAllUsers(query: { page?: string; limit?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { isDeleted: false },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where: { isDeleted: false } }),
    ]);

    return {
      users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findFirst({
      where: { id, isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found!');
    }

    return user;
  }

  static async updateUser(id: string, payload: { name?: string; email?: string; role?: UserRole; password?: string }) {
    const user = await prisma.user.findFirst({
      where: { id, isDeleted: false },
    });

    if (!user) {
      throw new AppError(404, 'User not found!');
    }

    const updateData: any = { ...payload };
    if (payload.password) {
      updateData.password = await hashPassword(payload.password);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  static async softDeleteUser(id: string) {
    const user = await prisma.user.findFirst({
      where: { id, isDeleted: false },
    });

    if (!user) {
      throw new AppError(404, 'User not found!');
    }

    await prisma.user.update({
      where: { id },
      data: { isDeleted: true },
    });

    return { message: 'User deleted successfully (soft delete)' };
  }
}
