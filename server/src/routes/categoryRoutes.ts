import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { allowGuests } from '~middleware/validateRoles';
import { CategoryResponse, ErrorResponse } from '~types';

const router = Router();
const prisma = new PrismaClient();

router.get('/', allowGuests, async (_req: Request, res: Response<CategoryResponse | ErrorResponse>) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    return res.json({ categories });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching categories' });
  }
});

export default router;