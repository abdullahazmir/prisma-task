import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { verifyToken } from '../utils/jwt';

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Unauthorized access! Token missing or invalid.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error: any) {
    next(new AppError(401, error.message || 'Unauthorized access! Token verification failed.'));
  }
};
