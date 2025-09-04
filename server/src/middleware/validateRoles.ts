import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest, UserRole, InventoryMiddlewareRequest, UserProfile } from '~types';

const prisma = new PrismaClient();

interface InventoryRole {
  user: UserProfile, 
  inventoryId: string, 
  inventory: { createdBy: string; isPublic: boolean }
}

export const getUserInventoryRole = async ({ user, inventoryId, inventory }: InventoryRole): Promise<UserRole.OWNER | UserRole.EDITOR | null> => {
  try {
    if (!inventory) return null;

    if (inventory.createdBy === user.id) return UserRole.OWNER;
    if (user.isAdmin) return UserRole.OWNER;

    const userId = user.id;

    const inventoryEditor = await prisma.inventoryEditor.findUnique({
      where: { inventoryId_userId: { inventoryId, userId } }
    });

    if (inventoryEditor) return UserRole.EDITOR;
    
    if (inventory.isPublic) return UserRole.EDITOR;

    return null;
  } catch (error) {
    console.error('Error getting user inventory role:', error);
    return null;
  }
}
export const loadInventoryRole = async (req: InventoryMiddlewareRequest, res: Response, next: NextFunction) => {
  try {
    const inventoryId = req.params.inventoryId || req.params.id;
    const user = req.user;

    if (!inventoryId) { return res.status(400).json({ error: 'Inventory ID is required' }) }

    const inventory = await prisma.inventory.findUnique({
      where: { id: inventoryId },
      select: { 
        id: true,
        createdBy: true, 
        isPublic: true,
        creator: { select: { id: true, name: true, email: true } }
      }
    });

    if (!inventory) {
      return res.status(404).json({ error: 'Inventory not found' });
    }

    req.inventory = inventory;

    if (user) {
      req.userRole = await getUserInventoryRole({ user, inventoryId, inventory });
    }

    next();
  } catch (error) {
    console.error('Error loading inventory role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const requireRole = (required: UserRole.OWNER | UserRole.EDITOR) => {
  return (req: InventoryMiddlewareRequest, res: Response, next: NextFunction) => {
    const role = req.userRole;

    if (!role) {
      return res.status(403).json({
        error: `Access denied. No role found for this inventory.`,
        userRole: role,
        requiredRole: required
      });
    }

    const hasPermission = role === UserRole.OWNER || (required === UserRole.EDITOR && role === UserRole.EDITOR);

    if (!hasPermission) {
      return res.status(403).json({
        error: `Insufficient permissions. ${required} role required.`,
        userRole: role,
        requiredRole: required
      });
    }

    next();
  };
};
export const requireEditor = requireRole(UserRole.EDITOR);
export const requireOwner = requireRole(UserRole.OWNER);
export const requireOwnerRole = [ loadInventoryRole, requireOwner ];
export const requireEditorRole = [loadInventoryRole, requireEditor ];

export const allowGuests = (req: Request, res: Response, next: NextFunction) => next();

export const requireSystemAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) return res.status(403).json({ error: 'Admin access required' });
  next();
};

