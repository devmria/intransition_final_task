import { Card, Skeleton, CardContent, Box } from "@mui/material";

export const SkeletonCard = () => (
  <Card>
    <Skeleton variant="rectangular" height={140} />
    <CardContent>
      <Skeleton variant="text" height={28} />
      <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="text" width={60} />
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={80} />
        </Box>
        <Skeleton variant="text" width={60} />
      </Box>
    </CardContent>
  </Card>
);