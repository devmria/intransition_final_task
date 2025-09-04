import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '~middleware/validateAuth';
import { AuthenticatedRequest, ErrorResponse, SuccessResponse } from '~types';

const router = Router();
const prisma = new PrismaClient();

router.post('/:itemId/like', authMiddleware, async (req: AuthenticatedRequest, res: Response<SuccessResponse | ErrorResponse>) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?.id;

    const existingItem = await prisma.item.findUnique({
      where: { id: itemId },
      select: { 
        likedBy: { 
          where: { id: userId },
          select: { id: true }
        }
      }
    });

    const hasLiked = Boolean(existingItem?.likedBy.length);

    if (hasLiked) {
      await prisma.item.update({
        where: { id: itemId },
        data: {
          likedBy: {
            disconnect: { id: userId }
          }
        }
      });
    } else {
      await prisma.item.update({
        where: { id: itemId },
        data: {
          likedBy: {
            connect: { id: userId }
          }
        }
      });
    }

    return res.json({ message: 'Inventory successfully liked' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;