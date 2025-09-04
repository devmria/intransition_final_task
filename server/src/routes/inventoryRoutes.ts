import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';
import { authMiddleware } from '~middleware/validateAuth';
import { allowGuests, requireOwnerRole, requireSystemAdmin } from '~middleware/validateRoles';
import { ErrorResponse, InventoryListResponse, InventoryListItem, InventoryDetail, InventoryUpdate, InventoryCreateResponse, SuccessResponse, InventoryCreateRequest, AuthenticatedRequest, InventoryQueryFilters, TagResponse } from '~types';

const prisma = new PrismaClient();
const router = Router();

async function getOrCreateTags(tagNames: string[]): Promise<{ id: string }[]> {
  const uniqueNames = [...new Set(
    tagNames.map(tag => tag.trim().toLowerCase()).filter(Boolean)
  )];

  return Promise.all(
    uniqueNames.map(name =>
      prisma.tag.upsert({
        where: { name },
        create: { name },
        update: {}
      }).then((tag: any) => ({ id: tag.id }))
    )
  );
}

router.get('/', allowGuests, async (req: Request<{}, any, any, InventoryQueryFilters>, res: Response<InventoryListResponse | ErrorResponse>) => {
  const { search, category, isPublic, tag, limit, sortBy } = req.query;

  const where: any = {
    ...(category && { category: { name: category } }),
    ...(isPublic !== undefined && { isPublic: isPublic === 'true' }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }),
    ...(tag && { 
      tags: { 
        some: { name: tag } 
      } 
    })
  };

  let orderBy;
  try {
    switch (sortBy) {
      case 'popularity': orderBy = { items: { _count: 'desc' } as const }; break;
      case 'latest': orderBy = { createdAt: 'desc' as const }; break;
    }
    const inventories = await prisma.inventory.findMany({
      where,
      take: limit ? parseInt(limit as string) : undefined,
      orderBy,
      include: {
        creator: { select: { id: true, name: true } },
        category: true,
        tags: true,
        _count: { select: { items: true } }
      }
    });

    const formatted: InventoryListItem[] = inventories.map((inv: any) => {
      return {
        id: inv.id,
        title: inv.title,
        description: inv.description,
        category: {
          id: inv.category.id,
          name: inv.category.name
        },
        tags: inv.tags.map((tag: TagResponse) => tag.name),
        isPublic: inv.isPublic,
        imageUrl: inv.imageUrl,
        itemCount: inv._count.items,
        createdBy: inv.creator,
        createdAt: inv.createdAt.toISOString(),
        updatedAt: inv.updatedAt.toISOString()
      };
    });

    return res.json({ inventories: formatted });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching inventories' });
  }
});

router.get('/:id', allowGuests, async (req: Request<{id: string}>, res: Response<InventoryDetail | ErrorResponse>) => {
  const { id } = req.params;

  try {
    const inventory = await prisma.inventory.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        category: true,
        customFields: true,
        _count: { select: { items: true } },
        tags: true,
        inventoryEditors: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });

    if (!inventory) {
      return res.status(404).json({ error: 'Inventory not found' });
    }

    return res.json({
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
      editors: inventory.inventoryEditors.map((ie: any) => ({
        id: ie.user.id,
        name: ie.user.name,
        email: ie.user.email,
        role: ie.role.toLowerCase()
      })),
      version: inventory.version,
      createdAt: inventory.createdAt.toISOString(),
      updatedAt: inventory.updatedAt.toISOString(),
      customFields: inventory.customFields.map((field: any) => ({
        id: field.id,
        inventoryId: field.inventoryId,
        type: field.type,
        title: field.title,
        description: field.description,
        showInTable: field.showInTable,
        createdAt: field.createdAt.toISOString(),
        updatedAt: field.updatedAt.toISOString(),
      }))
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching invenory' });
  }
}
);

router.post('/', authMiddleware, async ( req: Request<{}, any, InventoryCreateRequest> & AuthenticatedRequest, res: Response<InventoryCreateResponse | ErrorResponse> ) => {
    const { title, description, category, tags, isPublic, imageUrl } = req.body;
    const userId = req.user!.id;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!category || !category.id) {
      return res.status(400).json({ error: 'Category is required' });
    }

    try {
      const categoryExists = await prisma.category.findFirst({ where: { id: category.id } });
      if (!categoryExists) {
        return res.status(400).json({ error: 'Invalid category' });
      }

      const createdInventory = await prisma.inventory.create({
        data: {
          title,
          description,
          categoryId: category.id,
          isPublic,
          imageUrl,
          createdBy: userId
        },
        include: { 
          category: true,
          creator: { select: { id: true, name: true } },
          tags: true,
          _count: { select: { items: true } }
        }
      });

      if (tags && tags.length) {
        const tagIds = await getOrCreateTags(tags);

        await prisma.inventory.update({
          where: { id: createdInventory.id },
          data: {
            tags: {
              set: tagIds
            }
          }
        });
      }

      const finalInventory = await prisma.inventory.findUnique({
        where: { id: createdInventory.id },
        include: {
          category: true,
          creator: { select: { id: true, name: true } },
          tags: true,
          _count: { select: { items: true } }
        }
      });

      if (!finalInventory) {
        return res.status(404).json({ error: 'Inventory not found' });
      }

      return res.json({
        id: finalInventory.id,
        title: finalInventory.title,
        description: finalInventory.description,
        category: {
          id: finalInventory.category.id,
          name: finalInventory.category.name
        },
        tags: finalInventory.tags.map((tag: any) => tag.name),
        isPublic: finalInventory.isPublic,
        imageUrl: finalInventory.imageUrl,
        itemCount: finalInventory._count.items,
        createdBy: finalInventory.creator,
        createdAt: finalInventory.createdAt.toISOString(),
        updatedAt: finalInventory.updatedAt.toISOString()
      });
    } catch (error) {
      return res.status(500).json({ error: 'Error adding inventory' });
    }
  }
);

router.put('/:id', authMiddleware, requireOwnerRole, async ( req: Request<{ id: string }, any, InventoryUpdate>, res: Response<InventoryUpdate | ErrorResponse>) => {
    const { id } = req.params;
    const { title, description, category, tags, isPublic, imageUrl } = req.body;

    try {
      const currentInventory = await prisma.inventory.findUnique({ where: { id } });
      if (!currentInventory) {
        return res.status(404).json({ error: 'Inventory not found' });
      }

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (isPublic !== undefined) updateData.isPublic = isPublic;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

      if (category !== undefined) {
        const categoryExists = await prisma.category.findFirst({ where: { name: category.name } });
        if (!categoryExists) {
          return res.status(400).json({ error: 'Invalid category' });
        }
        updateData.categoryId = categoryExists.id;
      }

      const updatedInventory = await prisma.inventory.update({
        where: { id },
        data: updateData
      });

      if (tags !== undefined) {
        const tagIds = await getOrCreateTags(tags);

        await prisma.inventory.update({
          where: { id },
          data: {
            tags: {
              set: tagIds
            }
          }
        });
      }

      const inventory = await prisma.inventory.findUnique({
        where: { id },
        include: {
          category: true,
          tags: true
        }
      });

      return res.json({
        id: updatedInventory.id,
        title: updatedInventory.title,
        description: updatedInventory.description,
        category: {
          id: inventory?.category.id || '',
          name: inventory?.category.name || ''
        },
        tags: inventory?.tags.map((tag: any) => tag.name) || [],
        isPublic: updatedInventory.isPublic,
        imageUrl: updatedInventory.imageUrl,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Error editing inventory' });
    }
  }
);

router.delete('/bulk', authMiddleware, requireSystemAdmin, async (req: Request<{}, any, { ids: string[] }> & AuthenticatedRequest, res: Response<SuccessResponse | ErrorResponse>) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Valid IDs required' });
    }
    try {
      await prisma.inventory.deleteMany({ 
        where: { id: { in: ids } } 
      });
      return res.json({ message: `Successfully deleted ${ids.length} inventories` });
    } catch (error) {
      return res.status(500).json({ error: 'Error deleting inventories' });
    }
  }
);

router.delete('/:id', authMiddleware, requireOwnerRole, async (req: Request<{ id: string }>, res: Response<SuccessResponse | ErrorResponse>) => {
    const { id } = req.params;
    try {
      await prisma.inventory.delete({ where: { id } });
      return res.json({ message: 'Inventory deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Error deleting inventory' });
    }
  }
);

export default router;