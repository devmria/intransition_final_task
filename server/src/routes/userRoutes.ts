import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';
import { authMiddleware } from '~middleware/validateAuth';
import { requireSystemAdmin } from '~middleware/validateRoles';
import { AuthenticatedRequest, UserProfile, UserInventoriesResponse, ErrorResponse, UserStatus, UserRole, SuccessResponse, UsersListResponse } from '~types';

const mapPrismaUserToProfile = (user: any): UserProfile => ({
  ...user,
  status: user.status as UserStatus,
  createdAt: user.createdAt.toISOString(),
  lastLoginAt: user.lastLoginAt.toISOString(),
  updatedAt: user.updatedAt.toISOString()
});

const prisma = new PrismaClient();
const router = Router();

router.get('', authMiddleware, async (_req: Request, res: Response<UsersListResponse | ErrorResponse>) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        lastLoginAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
        updatedAt: true
      }
    });
    const mappedUsers = users.map(mapPrismaUserToProfile);
    res.json({ users: mappedUsers });
  } catch (error) {
    res.status(500).json({ error: 'Error get users' });
  }
}); 

router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response<UserProfile | ErrorResponse>) => {
  try {
    const { id: userId } = req.params;
    const currentUser = req.user!;

    const canAccess = currentUser.id === userId || currentUser.isAdmin;
    if (!canAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(mapPrismaUserToProfile(user));
  } catch (error) {
    return res.status(500).json({ error: 'Error get user' });
  }
});

router.get('/:id/inventories/owned', authMiddleware, async (req: Request, res: Response<UserInventoriesResponse | ErrorResponse>) => {
  try {
    const { id: userId } = req.params;

    const inventories = await prisma.inventory.findMany({
      where: { createdBy: userId },
      include: {
        creator: { select: { id: true, name: true } },
        category: true,
        _count: { select: { items: true } },
        tags: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedInventories = inventories.map((inventory: any) => ({
      id: inventory.id,
      title: inventory.title,
      description: inventory.description,
      category: {
        id: inventory.category.id,
        name: inventory.category.name
      },
      tags: inventory.tags.map((tag: any) => tag.name),
      isPublic: inventory.isPublic,
      imageUrl: inventory.imageUrl,
      itemCount: inventory._count.items,
      createdBy: inventory.creator,
      userRole: UserRole.OWNER,
      createdAt: inventory.createdAt,
      updatedAt: inventory.updatedAt
    }));

    return res.json({ inventories: formattedInventories });
  } catch (error) {
    return res.status(500).json({ error: 'Error get owned inventories' });
  }
});

router.get('/:id/inventories/accessible', authMiddleware, async (req: Request, res: Response<UserInventoriesResponse | ErrorResponse>) => {
  try {
    const { id: userId } = req.params;

    const inventoryEditors = await prisma.inventoryEditor.findMany({
      where: { userId },
      include: {
        inventory: {
          include: {
            creator: { select: { id: true, name: true } },
            category: true,
            _count: { select: { items: true } },
            tags: true
          }
        }
      }
    });

    const formattedInventories = inventoryEditors.map((ie: any) => ({
      id: ie.inventory.id,
      title: ie.inventory.title,
      description: ie.inventory.description,
      category: {
        id: ie.inventory.category.id,
        name: ie.inventory.category.name
      },
      tags: ie.inventory.tags.map((tag: any) => tag.name),
      isPublic: ie.inventory.isPublic,
      imageUrl: ie.inventory.imageUrl,
      itemCount: ie.inventory._count.items,
      createdBy: ie.inventory.creator,
      userRole: UserRole.EDITOR,
      createdAt: ie.inventory.createdAt,
      updatedAt: ie.inventory.updatedAt
    }));

    return res.json({ inventories: formattedInventories });
  } catch (error) {
    return res.status(500).json({ error: 'Error get accessible inventories' });
  }
});

router.delete('', authMiddleware, requireSystemAdmin, async (req: Request, res: Response<SuccessResponse | ErrorResponse>) => {
  const { userIds } = req.body;

  if (!userIds && !Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ error: 'Valid ID(s) required' });
  }
  try {
    await prisma.user.updateMany({
      where: {
        id: { in: userIds },
        status: { not: 'DELETED' },
      },
      data: {
        status: 'DELETED',
      },
    });
    return res.json({ message:`Successfully deleted ${userIds.length} users` });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting users' });
  }
});

router.post('/block', authMiddleware, requireSystemAdmin, async (req: Request, res: Response<SuccessResponse | ErrorResponse>) => {
  const { userIds } = req.body; 

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ error: 'Valid ID(s) required' });
  }

  try {
    await prisma.user.updateMany({
      where: {
        id: { in: userIds },
      },
      data: {
        status: 'BLOCKED',
      },
    });

    return res.json({ message: `Successfully blocked ${userIds.length} users`});
  } catch (error) {
    return res.status(500).json({ error: 'Error bloking users' });
  }
});

router.post('/unblock', authMiddleware, requireSystemAdmin, async (req: Request, res: Response<SuccessResponse | ErrorResponse>) => {
  const { userIds } = req.body;

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ error: 'Valid ID(s) required' });
  }

  try {
    await prisma.user.updateMany({
      where: {
        id: { in: userIds },
        status: 'BLOCKED', 
      },
      data: {
        status: 'ACTIVE',
      },
    });

    return res.json({ message: `Successfully unblocked ${userIds.length} users` });
  } catch (error) {
    return res.status(500).json({ error: 'Error unblocking users' });
  }
});

router.post('/make-admin', authMiddleware, requireSystemAdmin, async(req: Request, res: Response<SuccessResponse | ErrorResponse>) => {
  const { userIds } = req.body; 

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ error: 'Valid ID(s) required' });
  }

  try {
    await prisma.user.updateMany({
      where: {
        id: { in: userIds },
      },
      data: {
        isAdmin: true,
      },
    });

    return res.json({ message: `Successfully assigned Admin role to ${userIds.length} users`});
  } catch (error) {
    return res.status(500).json({ error: 'Error making an admin' });
  }

}); 

router.post('/remove-admin', authMiddleware, requireSystemAdmin, async(req: Request, res: Response<SuccessResponse | ErrorResponse>) => {
  const { userIds } = req.body; 

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ error: 'Valid ID(s) required'});
  }

  try {
    await prisma.user.updateMany({
      where: {
        id: { in: userIds },
      },
      data: {
        isAdmin: false,
      },
    });

    return res.json({ message: `Successfully removed Admin role from ${userIds.length} users`});
  } catch (error) {
    return res.status(500).json({ error: 'Error removing an admin' });
  }

}); 

export default router;