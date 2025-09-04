import { InventoryDetail } from '@intransition/shared-types';
import { Alert, Typography, Box } from '@mui/material';

interface Props {
  inventory: InventoryDetail;
}

export const CustomID = ({ inventory }: Props) => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4" gutterBottom>
        Custom ID Format
      </Typography>
      <Box>Custom ID for Inventory: {inventory.title}</Box>
      <Alert severity="info">
        Custom ID format configuration will be implemented in a future phase.
      </Alert>
    </Box>
  );
}