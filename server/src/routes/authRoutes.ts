import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { authMiddleware } from '~middleware/validateAuth';
import { validateAuthBody } from '~middleware/validateAuthBody';
import { registerSchema, loginSchema } from '~middleware/validationSchema';
import { AuthenticatedRequest, ErrorResponse, LoginRequest, RegisterRequest, SuccessResponse, UserProfile } from '~types';
import { serializeUser } from '~utils/serializers';

const prisma = new PrismaClient();
const router = Router();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined");
}
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', validateAuthBody(loginSchema), async (req: Request<{}, any, LoginRequest>, res: Response<UserProfile | ErrorResponse>) => {
  const { email, password } = req.body;
  
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(401).json({ error: 'User doesn`t exist' });
  if (user.status === 'DELETED') {
    return res.status(403).json({ error: 'User is deleted' });
  }
  if (user.status === 'BLOCKED') {
    return res.status(403).json({ error: 'User is blocked' });
  }
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  });

  const token = jwt.sign({ id: user.id }, JWT_SECRET );

  res.cookie('accessToken', token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: '/'
  });

  return res.json(serializeUser(updatedUser));
});

router.post('/register', validateAuthBody(registerSchema), async (req: Request<{}, any, RegisterRequest>, res: Response<UserProfile | ErrorResponse>) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      if (existingUser.status === 'BLOCKED') {
        return res.status(403).json({ error: 'User is blocked' });
      }
      if (existingUser.status === 'DELETED') {
        const passwordHash = await bcrypt.hash(password, 10);
        const restoredUser = await prisma.user.update({
          where: { email },
          data: {
            name,
            passwordHash,
            status: 'ACTIVE',
          }
        });

        const token = jwt.sign({ id: restoredUser.id }, JWT_SECRET );
        res.cookie('accessToken', token, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          path: '/'
        });

        return res.json(serializeUser(restoredUser));
      }

      res.status(409).json({ error: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, status: 'ACTIVE' }
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET );

    res.cookie('accessToken', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/'
    });

    return res.json(serializeUser(user));
  } catch (error) {
    return res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/logout', (_req: Request, res: Response<SuccessResponse | ErrorResponse>) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/'
  });
  return res.json({ message: 'Logout successful' });
});

router.get('/current', authMiddleware, async (req: AuthenticatedRequest, res: Response<UserProfile | ErrorResponse>) => {
  const user = req.user;

  if (!user || user.status !== 'ACTIVE') {
    return res.status(403).json({ error: 'Access denied: blocked or deleted user' });
  }
  return res.json(serializeUser(user));
});

export default router;