import { UserInventoryItem } from "@intransition/shared-types";
import { Public, Visibility, Lock, Delete } from "@mui/icons-material";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box, Typography, Tooltip, IconButton } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formatDate } from "~components/atoms/DateTools";
import { InventoryService } from "~services/Inventory/InventoryService";

type Props = {
  isOwner: boolean,
  inventories: UserInventoryItem[],
  setInventories: React.Dispatch<React.SetStateAction<UserInventoryItem[]>>
}

export const InventoriesTable = ({isOwner, inventories, setInventories}: Props) => {
  const navigate = useNavigate();
  const [deletingInventoryId, setDeletingInventoryId] = useState<string | null>(null);

  const handleInventoryClick = (inventoryId: string) => {
    navigate(`/inventory/${inventoryId}`);
  };

  const handleViewInventory = (inventoryId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/inventory/${inventoryId}`);
  };

  const handleDeleteInventory = async (inventoryId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      setDeletingInventoryId(inventoryId);
      await InventoryService.deleteInventory(inventoryId);
      setInventories(prev => prev.filter(inv => inv.id !== inventoryId));
      toast.success('Inventory deleted');
    } catch(error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete inventory');
    }
    setDeletingInventoryId(null);
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ maxWidth: 100 }}>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell align="center">Items</TableCell>
            <TableCell align="center">Visibility</TableCell>
            <TableCell>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventories.map((inventory) => (
            <TableRow 
              key={inventory.id} 
              hover 
              sx={{ cursor: 'pointer' }}
              onClick={() => handleInventoryClick(inventory.id)}
            >
              <TableCell sx={{ maxWidth: 100 }}>
                <Box>
                <Typography variant="body2" fontWeight="medium" 
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1.2
                    }}
                  >
                    {inventory.title}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1.3,
                      wordBreak: 'break-word'
                    }}
                  >
                    {inventory.description}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{inventory.category.name}</TableCell>
              <TableCell align="center">{inventory.itemCount}</TableCell>
              <TableCell align="center">
                {inventory.isPublic ? (
                  <Tooltip title="Public">
                    <Public color="success" />
                  </Tooltip>
                ) : (
                  <Tooltip title="Private">
                    <Lock color="action" />
                  </Tooltip>
                )}
              </TableCell>
              <TableCell>{formatDate(inventory.createdAt)}</TableCell>
              <TableCell align="center">
                <Tooltip title="View">
                  <IconButton 
                    size="small"
                    onClick={(e) => handleViewInventory(inventory.id, e)}
                  >
                    <Visibility />
                  </IconButton>
                </Tooltip>
              </TableCell>
              { isOwner &&
                  <TableCell align="center">
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small"
                        color="error"
                        loading={deletingInventoryId === inventory.id}
                        onClick={(event) => handleDeleteInventory(inventory.id, event)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                }
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer>
  );
}