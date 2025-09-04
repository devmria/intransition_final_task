import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '~middleware/validateAuth';
import { requireOwnerRole } from '~middleware/validateRoles';
import { UserRole, InventoryMiddlewareRequest, ErrorResponse, InventoryAccessListResponse, AddAccessResponse, RevokeAccessResponse, GrantAccessData } from '~types';

const router = Router();
const prisma = new PrismaClient();

router.get('/:inventoryId/access', authMiddleware, requireOwnerRole, async (req: InventoryMiddlewareRequest, res: Response<InventoryAccessListResponse | ErrorResponse>) => {
    try {
      const inventory = req.inventory!;
      const owner = inventory.creator;

      const inventoryEditors = await prisma.inventoryEditor.findMany({
        where: { inventoryId: inventory.id },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      const result = [
        {
          id: owner.id,
          user: owner,
          role: UserRole.OWNER,
          isOwner: true
        },
        ...inventoryEditors.map((editor: any) => ({
          id: editor.user.id,
          user: editor.user,
          role: editor.role,
          isOwner: false
        }))
      ];
      res.json({ accesseUsersList: result });
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching inventory access' });
    }
  }
);

router.post('/:inventoryId/access', authMiddleware, requireOwnerRole, async (req: InventoryMiddlewareRequest<GrantAccessData>, res: Response<AddAccessResponse | ErrorResponse>) => {
    try {
      const inventory = req.inventory!;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (inventory.createdBy === userId) {
        return res.status(400).json({ error: 'Cannot modify owner permissions' });
      }

      try {
        await prisma.inventoryEditor.create({
          data: {
            inventoryId: inventory.id,
            userId,
            role: 'EDITOR',
          },
        });
      } catch (error: any) {
        if (error.code === 'P2002') {
          return res.status(400).json({ error: 'User already has editor access' });
        }
        throw error;
      }

      const addedUser = {
        id: user.id,
        user: user,
        role: UserRole.EDITOR,
        isOwner: false
      }
      res.status(201).json({ addedUser });
    } catch (error) {
      return res.status(500).json({ error: 'Error adding editor' });
    }
  }
);

router.delete('/:inventoryId/access/:userId', authMiddleware, requireOwnerRole, async (req: InventoryMiddlewareRequest, res: Response<RevokeAccessResponse | ErrorResponse>) => {
    try {
      const inventory = req.inventory!;
      const { userId } = req.params;

      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (inventory.createdBy === user.id) {
        return res.status(400).json({ error: 'Cannot remove owner access' });
      }

      await prisma.inventoryEditor.delete({
        where: {
          inventoryId_userId: {
            inventoryId: inventory.id,
            userId: user.id
          }
        }
      });

      res.status(200).json({ id: userId });
    } catch (error) {
      return res.status(404).json({ error: 'Error removing editor' });
    }
  }
);

export default router;