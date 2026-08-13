import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const roleGuard = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Unauthorized access! User context missing.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'Forbidden! You do not have permission to access this resource.'));
    }

    next();
  };
};
