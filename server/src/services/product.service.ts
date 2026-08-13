import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { ProductStatus } from '@prisma/client';

export interface IProductFilterQuery {
  search?: string;
  categoryId?: string;
  status?: ProductStatus;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: string;
  limit?: string;
}

export class ProductService {
  static async createProduct(payload: {
    name: string;
    description: string;
    price: number;
    stock?: number;
    status?: ProductStatus;
    categoryId: string;
  }) {
    const category = await prisma.category.findFirst({
      where: { id: payload.categoryId, isDeleted: false },
    });

    if (!category) {
      throw new AppError(400, 'Invalid Category ID!');
    }

    return await prisma.product.create({
      data: {
        name: payload.name,
        description: payload.description,
        price: payload.price,
        stock: payload.stock ?? 0,
        status: payload.status || ProductStatus.AVAILABLE,
        categoryId: payload.categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  static async getAllProducts(query: IProductFilterQuery) {
    const {
      search,
      categoryId,
      status,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = '1',
      limit = '10',
    } = query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const whereConditions: any = {
      isDeleted: false,
    };

    if (search) {
      whereConditions.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      whereConditions.categoryId = categoryId;
    }

    if (status) {
      whereConditions.status = status;
    }

    if (minPrice || maxPrice) {
      whereConditions.price = {};
      if (minPrice) whereConditions.price.gte = Number(minPrice);
      if (maxPrice) whereConditions.price.lte = Number(maxPrice);
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereConditions,
        include: {
          category: true,
          reviews: {
            where: { isDeleted: false },
            select: { rating: true },
          },
        },
        skip,
        take: limitNum,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.product.count({ where: whereConditions }),
    ]);

    const formattedProducts = products.map((product) => {
      const avgRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
          : 0;
      return {
        ...product,
        averageRating: Number(avgRating.toFixed(1)),
        reviewCount: product.reviews.length,
      };
    });

    return {
      products: formattedProducts,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findFirst({
      where: { id, isDeleted: false },
      include: {
        category: true,
        reviews: {
          where: { isDeleted: false },
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new AppError(404, 'Product not found!');
    }

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

    return {
      ...product,
      averageRating: Number(avgRating.toFixed(1)),
      reviewCount: product.reviews.length,
    };
  }

  static async updateProduct(
    id: string,
    payload: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      status?: ProductStatus;
      categoryId?: string;
    }
  ) {
    const product = await prisma.product.findFirst({
      where: { id, isDeleted: false },
    });

    if (!product) {
      throw new AppError(404, 'Product not found!');
    }

    if (payload.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: payload.categoryId, isDeleted: false },
      });
      if (!category) {
        throw new AppError(400, 'Invalid Category ID!');
      }
    }

    return await prisma.product.update({
      where: { id },
      data: payload,
      include: {
        category: true,
      },
    });
  }

  static async softDeleteProduct(id: string) {
    const product = await prisma.product.findFirst({
      where: { id, isDeleted: false },
    });

    if (!product) {
      throw new AppError(404, 'Product not found!');
    }

    await prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });

    return { message: 'Product deleted successfully (soft delete)' };
  }
}
