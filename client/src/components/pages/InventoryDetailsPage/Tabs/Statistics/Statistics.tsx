import { InventoryDetail } from '@intransition/shared-types';
import { Alert, Typography, Box } from '@mui/material';
import { formatDate } from '~components/atoms/DateTools';

interface Props {
  inventory: InventoryDetail;
}

export const Statistics = ({ inventory }: Props) => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4" gutterBottom>
        Statistics & analytics
      </Typography>
      <Typography variant="body2">
        Basic statistics for "{inventory.title}"
      </Typography>
      <Typography variant="body2">
        Total items: {inventory.itemCount || 0}
      </Typography>
      <Typography variant="body2">
        Created: {formatDate(inventory.createdAt)}
      </Typography>
      <Typography variant="body2">
        Last updated: {formatDate(inventory.updatedAt)}
      </Typography>
      <Alert severity="info">
        Statistics and analytics will be implemented in a future phase.
      </Alert>
    </Box>
  );
}