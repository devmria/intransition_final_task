import { PrismaClient } from "@prisma/client";
import { Router, Response, Request } from "express";
import { authMiddleware } from "~middleware/validateAuth";
import { requireOwnerRole } from "~middleware/validateRoles";
import { ChangeField, CustomField, CustomFieldCreateRequest, CustomFieldsList, ErrorResponse, SuccessResponse } from "~types";

const router = Router();
const prisma = new PrismaClient();

router.get('/:inventoryId', async (req: Request, res: Response<CustomFieldsList | ErrorResponse>) => {
  try {
    const { inventoryId } = req.params;

    const customFields = await prisma.customField.findMany({
      where: { inventoryId },
      select: {
        id: true,
        inventoryId: true,
        type: true,
        title: true,
        description: true,
        showInTable: true,
        createdAt: true,
      }
    })

    const formatted: CustomField[] = customFields.map((field: any) => {
      return {
        id: field.id,
        inventoryId: field.inventoryId,
        type: field.type,
        title: field.title,
        description: field.description,
        showInTable: field.showInTable,
        createdAt: field.createdAt.toISOString(),
      }
    })

    res.json({ customFields: formatted })
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching custom fields' })
  }
}) 

router.post('/:inventoryId', async (req: Request<{inventoryId: string}, any, CustomFieldCreateRequest>, res: Response<SuccessResponse | ErrorResponse>) => {
  try {
    const { inventoryId } = req.params;
    const { type, title, description, showInTable } = req.body;

    await prisma.customField.create({
      data: {
        inventoryId,
        type,
        title,
        description,
        showInTable: showInTable ?? true
      }
    })
    res.json({ message: 'Custom field created successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Error creating custom field' })
  }
})

router.put('/:id', authMiddleware, async (req: Request<{id: string}, any, ChangeField>, res: Response<SuccessResponse | ErrorResponse>) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { type, title, description, showInTable } = data;

    const updateData: any = {};
    if (type !== undefined) updateData.type = type;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (showInTable !== undefined) updateData.showInTable = showInTable;

    await prisma.customField.update({
      where: { id },
      data: updateData
    });

    return res.json({ message: 'Field updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Error edit custom field' })
  }
})

router.delete('/:fieldId', authMiddleware, async (req: Request<{fieldId: string}>, res: Response<SuccessResponse | ErrorResponse>) => {
  try {
    const { fieldId } = req.params;

    await prisma.customField.delete({
      where: { id: fieldId }
    })
    return res.json({ message: 'Custom field deleted successfully' })
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting custom field' })
  }
})

export default router;