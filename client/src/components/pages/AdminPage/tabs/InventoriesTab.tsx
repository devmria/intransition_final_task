import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Chip, IconButton, Tooltip, Card, CardContent } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { InventoryService } from "~services/Inventory/InventoryService";
import { InventoryListItem } from "@intransition/shared-types";
import { SkeletonTableRow } from "~components/atoms/skeletons/SkeletonTableRow";
import { formatDate } from "~components/atoms/DateTools";

export const InventoriesTab = () => {
  const [inventories, setInventories] = useState<InventoryListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    fetchInventories();
  }, []);

  const fetchInventories = async () => {
    try {
      setLoading(true);
      const data = await InventoryService.getInventories({});
      setInventories(data.inventories);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error fetch inventories');
    }
    setLoading(false);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(inventories.map(inventory => inventory.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelected(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleDelete = async () => {
    if (selected.length === 0) return;
    try {
      await InventoryService.deleteInventories(selected);
      toast.success(`Successfully deleted ${selected.length} inventor(ies)`);
      await fetchInventories();
      setSelected([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to delete inventories`);
    }
  };

  return (
    <Box display="grid" gap={2}>
      <Box display="grid" gap={2}>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {loading ? 'Loading...' : `${inventories.length} inventories found`}
        </Typography>

        {selected.length > 0 && (
          <Card variant="outlined">
              <Typography variant="h6" p={1}>
                {selected.length} inventor(ies) selected
              </Typography>

            <CardContent sx={{ display: 'flex', flexWrap: 'wrap', gap: {xs: 1, sm: 3}, justifyContent: 'flex-start'}} >
              <Tooltip title="Delete inventories">
                <IconButton onClick={handleDelete} color="error" size="small">
                  <Delete sx={{mr: 1}}/>
                  Delete
                </IconButton>
              </Tooltip>
            </CardContent>
          </Card>
        )}

      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < inventories.length}
                  checked={inventories.length > 0 && selected.length === inventories.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Creator</TableCell>
              <TableCell>Public</TableCell>
              <TableCell>Items Count</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonTableRow key={index} amount={7} />
                ))
              : inventories.map((inventory) => {
                  const isSelected = selected.includes(inventory.id);
                  return (
                    <TableRow 
                      key={inventory.id} 
                      hover 
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelectItem(inventory.id) }
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium"                       
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 80,
                          }}
                        >
                          {inventory.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={inventory.category.name}
                          size="small"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {inventory.createdBy.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={inventory.isPublic ? 'Public' : 'Private'}
                          size="small"
                          color={inventory.isPublic ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {inventory.itemCount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(inventory.createdAt)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && inventories.length === 0 && (
        <Box textAlign="center" py={6}>
          <Typography variant="h6" gutterBottom>
            No inventories found
          </Typography>
          <Typography variant="body2">
            There are no inventories in the system.
          </Typography>
        </Box>
      )}
    </Box>
  );
};