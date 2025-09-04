import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '~middleware/validateAuth';
import { allowGuests } from '~middleware/validateRoles';
import { ErrorResponse, TagCreateRequest, TagResponse, TagsListResponse } from '~types';

const router = Router();
const prisma = new PrismaClient();

router.get('/', allowGuests, async (_req: Request, res: Response<TagsListResponse | ErrorResponse>) => {
  try {
    const tags = await prisma.tag.findMany();
    return res.json({ tags });
  } catch (error) {
    return res.status(500).json({ error: 'Can`t get tags list' });
  }
});

router.post('/', authMiddleware, async (req: Request<{}, any, TagCreateRequest>, res: Response<TagResponse | ErrorResponse>) => {
  const { name } = req.body;
  if (!name?.trim()) {
    return res.status(400).json({ error: 'Tag name required' });
  }
  try {
    const tag = await prisma.tag.create({
      data: { name: name.toLowerCase() }
    });
    return res.json(tag);
  } catch (error) {
    return res.status(409).json({ error: 'Tag already exists' });
  }
});

export default router;