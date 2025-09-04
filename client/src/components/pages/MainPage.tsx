import { Typography, Box, Grid, Chip, Skeleton, Stack } from '@mui/material';
import { Inventory as InventoryIcon, TrendingUp } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InventoryService } from '~services/Inventory/InventoryService';
import { TagService } from '~services/Tag/TagService';
import { InventoryCard } from '~components/molecules/InventoryCard';
import { InventoryListItem, TagResponse } from '@intransition/shared-types';
import { SkeletonCard } from '~components/atoms/skeletons/SkeletinCard';
import { toast } from 'react-toastify';

export const MainPage = () => {
  const navigate = useNavigate();
  const [latestInventories, setLatestInventories] = useState<InventoryListItem[]>();
  const [popularInventories, setPopularInventories] = useState<InventoryListItem[]>();
  const [tags, setTags] = useState< TagResponse[]>();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const latestResponse = await InventoryService.getInventories({ limit: '2', sortBy: 'latest' });
        const popularResponse = await InventoryService.getInventories({ limit: '3', sortBy: 'popularity'});
        const fetchedTags = await TagService.getTags();
        setLatestInventories(latestResponse.inventories);
        setPopularInventories(popularResponse.inventories);
        setTags(fetchedTags.tags);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Error fetching home data');
      } 
      setLoading(false);
    };
    fetchHomeData();
  }, []);

  const handleTagClick = (tagName: string) => {
    navigate(`/inventories?tag=${tagName}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack textAlign="center" gap={2}>
        <Typography variant="h2" component="h1">Intransition</Typography>
        <Typography variant="h3" component="h1">Inventory Management System</Typography>
      </Stack>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InventoryIcon />
          Latest Inventories
        </Typography>
        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Grid size={{xs:12, sm:6, md:4}} key={index}>
                  <SkeletonCard />
                </Grid>
              ))
            : latestInventories?.map((inventory) => (
                <Grid size={{xs:12, sm:6, md:4}} key={inventory.id}>
                  <InventoryCard inventory={inventory} />
                </Grid>
              ))
            }
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp />
          Popular Inventories
        </Typography>
        <Typography variant="body2" >
          Popular by number of items
        </Typography>
        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Grid size={{xs:12, sm:6, md:4}} key={index}>
                  <SkeletonCard />
                </Grid>
              ))
            : popularInventories?.map((inventory) => (
                <Grid size={{xs:12, sm:6, md:4}} key={inventory.id}>
                  <InventoryCard inventory={inventory} />
                </Grid>
              ))}
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Browse by Tags
        </Typography>
        <Typography variant="body2" >
          Click on a tag to search for related inventories
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} variant="rounded" width={80} height={32} />
              ))
            : tags?.map((tag:any) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  onClick={() => handleTagClick(tag.name)}
                  variant="outlined"
                />
              ))}
        </Box>
      </Box>
    </Box>
  );
};