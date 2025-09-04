import { InventoryDetail } from '@intransition/shared-types';
import { Typography, Alert, Box } from '@mui/material';

interface Props {
  inventory: InventoryDetail;
}

export const InventoryItems = ({ inventory }: Props) => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4" gutterBottom>
        Items ({inventory.itemCount || 0})
      </Typography>
      <Alert severity="info">
        Items functionality will be implemented in the next phase.
      </Alert>
    </Box>
  );
}