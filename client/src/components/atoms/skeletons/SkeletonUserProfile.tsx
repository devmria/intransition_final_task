import { Box, Card, CardContent, Grid, Skeleton } from "@mui/material";

export const SkeletonUserProfile = () => (
  <Box maxWidth="lg" sx={{ py: 4 }}>
    <Grid container spacing={3}>
      <Grid size={{xs:12, md:4}}>
        <Card>
          <CardContent>
            <Skeleton variant="circular" width={80} height={80} sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="text" height={32} />
            <Skeleton variant="text" height={24} />
            <Skeleton variant="text" height={24} />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{xs:12, md:8}}>
        <Skeleton variant="rectangular" height={200} />
      </Grid>
    </Grid>
  </Box>
);