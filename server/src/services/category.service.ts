import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';

export class CategoryService {
  static async createCategory(payload: { name: string; description?: string }) {
    const slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name: payload.name }, { slug }],
        isDeleted: false,
      },
    });

    if (existing) {
      throw new AppError(400, 'Category with this name already exists!');
    }

    return await prisma.category.create({
      data: {
        name: payload.name,
        slug,
        description: payload.description,
      },
    });
  }

  static async getAllCategories() {
    return await prisma.category.findMany({
      where: { isDeleted: false },
      orderBy: { name: 'asc' },
    });
  }

  static async getCategoryById(id: string) {
    const category = await prisma.category.findFirst({
      where: { id, isDeleted: false },
      include: {
        products: {
          where: { isDeleted: false },
        },
      },
    });

    if (!category) {
      throw new AppError(404, 'Category not found!');
    }

    return category;
  }

  static async updateCategory(id: string, payload: { name?: string; description?: string }) {
    const category = await prisma.category.findFirst({
      where: { id, isDeleted: false },
    });

    if (!category) {
      throw new AppError(404, 'Category not found!');
    }

    const updateData: any = { ...payload };
    if (payload.name) {
      updateData.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    return await prisma.category.update({
      where: { id },
      data: updateData,
    });
  }

  static async softDeleteCategory(id: string) {
    const category = await prisma.category.findFirst({
      where: { id, isDeleted: false },
    });

    if (!category) {
      throw new AppError(404, 'Category not found!');
    }

    await prisma.category.update({
      where: { id },
      data: { isDeleted: true },
    });

    return { message: 'Category deleted successfully (soft delete)' };
  }
}
