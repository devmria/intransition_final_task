import { CustomField, InventoryDetail } from '@intransition/shared-types';
import { Delete, Edit } from '@mui/icons-material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';
import { Alert, Typography, Box, Card, ListItem, ListItemText, IconButton, ListItemIcon, Button } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { FieldService } from '~services/Fields/FieldService';

interface Props {
  inventory: InventoryDetail;
}

export const InventoryFields = ({ inventory }: Props) => {
  const [fields, setFields] = useState<CustomField[]>(inventory.customFields || []);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteField = async(event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    event?.preventDefault();
    try {
      setDeleteLoading(true)
      await FieldService.deleteField(id)
      setFields(fields.filter(item => item.id !== id))
      toast.success('Field successfully deleted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete field');
    }
    setDeleteLoading(false);
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4" gutterBottom>
        Custom fields ({fields.length})
      </Typography>
      {fields.length === 0 && <Alert severity="info">There are no custom fields in this item</Alert>}

        {fields && Array.isArray(fields) && fields.map((field:CustomField) => (
          <Card key={field.id}>
            <ListItem>
              <ListItemIcon>
                <FormatListBulletedIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography variant="h5">{field.title}</Typography>
                    <Typography variant="h6">{field.description}</Typography>
                    <Typography variant="body1">Type: {field.type}</Typography>
                    <Typography variant="body1">Show in table: {field.showInTable.toString()}</Typography>
                  </Box>
                }
              />
               <Box display="flex" gap={3}>
              <IconButton
                edge="end"
                // onClick={() => handleEditField(field.id)}
                disabled
                title="Edit field"
              >
                <Edit />
              </IconButton>
              <IconButton
                edge="end"
                onClick={(event) => handleDeleteField(event, field.id)}
                loading={deleteLoading}
                color="error"
                title="Delete field"
              >
                <Delete />
              </IconButton>
              </Box>
            </ListItem>
          </Card>
        ))}

        <Button
          // type="submit" 
          variant="contained"
          disabled
          startIcon={<FormatListBulletedAddIcon/>}
        >
          Add new field
        </Button>
      
    </Box>
  );
}