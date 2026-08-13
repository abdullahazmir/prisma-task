import jwt, { Secret } from 'jsonwebtoken';

export interface IJwtPayload {
  id: string;
  email: string;
  role: string;
}

export const generateToken = (payload: IJwtPayload): string => {
  const secret = (process.env.JWT_SECRET || 'secret') as Secret;
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as any;

  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string): IJwtPayload => {
  const secret = (process.env.JWT_SECRET || 'secret') as Secret;
  return jwt.verify(token, secret) as IJwtPayload;
};

