import { prisma } from '../lib/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import { UserRole } from '@prisma/client';

export class AuthService {
  static async register(payload: { name: string; email: string; password: string; role?: UserRole }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (existingUser) {
      throw new AppError(400, 'User with this email already exists!');
    }

    const hashedPassword = await hashPassword(payload.password);

    const newUser = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: payload.role || UserRole.USER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });

    return { user: newUser, token };
  }

  static async login(payload: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user || user.isDeleted) {
      throw new AppError(401, 'Invalid credentials!');
    }

    const isPasswordMatched = await comparePassword(payload.password, user.password);
    if (!isPasswordMatched) {
      throw new AppError(401, 'Invalid credentials!');
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
      throw new AppError(404, 'User profile not found!');
    }

    return user;
  }
}
