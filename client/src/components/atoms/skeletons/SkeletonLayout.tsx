import { Box, Skeleton } from '@mui/material';

export const SkeletonLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{borderBottom: 1, borderColor: 'divider' }}>
        <Skeleton variant="rectangular" height={64} />
      </Box>
      
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Skeleton variant="text" height={48} width="40%" sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={200} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={300} sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Skeleton variant="rectangular" height={150} sx={{ flex: 1 }} />
          <Skeleton variant="rectangular" height={150} sx={{ flex: 1 }} />
        </Box>
        <Skeleton variant="rectangular" height={100} />
      </Box>
      
      <Box sx={{ minHeight: 100, p: 2 }}>
        <Skeleton variant="rectangular" height={100} />
      </Box>
    </Box>
  );
};