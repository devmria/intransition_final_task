import { InventoryDetail } from '@intransition/shared-types';
import { Typography, Alert, Box } from '@mui/material';

interface Props  {
  inventory: InventoryDetail;
}

export const InventoryDiscussion = ({ inventory }: Props) => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4" gutterBottom>
        Discussion for "{inventory.title}"
      </Typography>
      <Alert severity="info">
        Discussion functionality will be implemented in the next phase.
      </Alert>
    </Box>
  );
}