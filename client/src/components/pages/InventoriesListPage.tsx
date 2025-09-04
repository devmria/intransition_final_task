import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, TextField, FormControl, InputLabel, Select, MenuItem, Tooltip, Avatar, Stack } from '@mui/material'; 
import { Add, Search, Public, Lock } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '~context/AuthContext';
import { InventoryService } from '~services/Inventory/InventoryService';
import { formatDate } from '~components/atoms/DateTools';
import { InventoryListItem, InventoryQueryFilters } from '@intransition/shared-types';
import { SkeletonTableRow } from '~components/atoms/skeletons/SkeletonTableRow';
import { useDebounce } from 'use-debounce';
import { useCategories } from '~context/CategoryContext';
import { InventoryCreateDialog } from '~components/molecules/InventoryCreateDialog';

export const InventoriesListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [category, setCategory] = useState(searchParams.get('category') ?? '');
  const [isPublic, setPublic] = useState(searchParams.get('isPublic') ?? '');
  const [tag, setTag] = useState(searchParams.get('tag') ?? '');

  const [debouncedSearch] = useDebounce(search, 1000);

  const [inventories, setInventories] = useState<InventoryListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { categories } = useCategories();

  useEffect(() => {
    fetchInventories();
  }, [category, isPublic, tag, debouncedSearch]);


  const fetchInventories = async () => {
    try {
      setLoading(true);
      const filters: InventoryQueryFilters = {};

      const newParams = new URLSearchParams();
    
      if (search) {
        newParams.set('search', search); 
        filters.search = search;
      } 
      if (category) {
        newParams.set('category', category)
        filters.category = category;
      }
      if (tag) {
        newParams.set('tag', tag)
        filters.tag = tag;
      } 
      if (isPublic) {
        newParams.set('isPublic', isPublic)
        filters.isPublic = isPublic;
      }
      setSearchParams(newParams);

      const response = await InventoryService.getInventories(filters);
      setInventories(response.inventories);
    } catch (error) {
      console.error('Failed to fetch inventories', error);
    }
    setLoading(false);
  };

  const handleInventoryClick = (inventoryId: string) => {
    navigate(`/inventory/${inventoryId}`);
  };

  const handleCreateSuccess = (newInventory: InventoryListItem) => {
    setCreateDialogOpen(false);
    navigate(`/inventory/${newInventory.id}`);
  };
  
  return (
    <Box maxWidth="xl">
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">Inventories</Typography>
          
          {user && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Create inventory
            </Button>
          )}
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack spacing={2}  direction='column'>
              <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems="center">
                <TextField fullWidth placeholder="Search inventories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  slotProps={{
                    input: { startAdornment: <Search sx={{ mr: 1 }} /> }
                  }}
                />

                <FormControl sx={{ width: '100%', maxWidth: {md: 200} }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={searchParams.get('category') ?? ''}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <MenuItem value={''}>All</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ width: '100%', maxWidth: {md: 200} }}>
                  <InputLabel>Visibility</InputLabel>
                  <Select
                    value={searchParams.get('isPublic') ?? ''}
                    label="Visibility"
                    onChange={(e) => setPublic(e.target.value)}
                  >
                    <MenuItem value={''}>All</MenuItem>
                    <MenuItem value="true">Public</MenuItem>
                    <MenuItem value="false">Private</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              { searchParams.get('tag') && <Box>Filtered by tag: <Chip label={searchParams.get('tag')} onDelete={() => setTag('')} /></Box> }
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell align="center">Items</TableCell>
              <TableCell align="center">Visibility</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? <SkeletonTableRow amount={7} />
              : inventories.map((inventory) => (
                  <TableRow 
                    key={inventory.id} 
                    hover 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleInventoryClick(inventory.id)}
                  >
                    <TableCell>
                      <Box>
                        <Typography fontWeight="medium"
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
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          maxWidth: 120,
                        }}
                      >
                        {inventory.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={inventory.category.name} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 24, height: 24 }}>
                          {inventory.createdBy.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">
                          {inventory.createdBy.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {inventory.itemCount}
                      </Typography>
                    </TableCell>
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
                    <TableCell>
                      <Box display="flex" gap={0.5} flexWrap="wrap">
                        {inventory.tags.slice(0, 2).map((tag: any, index: any) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                        {inventory.tags.length > 2 && (
                          <Chip
                            label={`+${inventory.tags.length - 2}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" >
                        {formatDate(inventory.createdAt)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && inventories.length === 0 && (
        <Box textAlign="center" py={6}>
          <Typography variant="h6"  gutterBottom>
            No inventories found
          </Typography>
          {user && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Create inventory
            </Button>
          )}
        </Box>
      )}

      <InventoryCreateDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </Box>
  );
};