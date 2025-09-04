import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AuthenticatedRequest, UserProfile, ErrorResponse, JWTPayload, UserStatus } from '~types';

const prisma = new PrismaClient();

export const authMiddleware = async (req: AuthenticatedRequest, res: Response<UserProfile | ErrorResponse>, next: NextFunction) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user || user.status === 'BLOCKED' || user.status === 'DELETED') {
      return res.status(403).json({ error: 'Access denied: user blocked or deleted' });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      status: user.status as UserStatus,
      createdAt: user.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
    next();
    
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    console.error('Unexpected auth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};