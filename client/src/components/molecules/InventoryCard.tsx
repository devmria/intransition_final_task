import { InventoryListItem } from "@intransition/shared-types";
import { Public, Lock } from "@mui/icons-material";
import { Card, CardContent, Typography, Box, Chip, Avatar, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatDate } from "~components/atoms/DateTools";

export const InventoryCard = ({ inventory }: { inventory: InventoryListItem }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }} onClick={() => navigate(`/inventory/${inventory.id}`)}>
      <CardContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
            <Typography variant="h5" component="h3"
              sx={{
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
                flex: 1,
                minWidth: 0
              }}
            >
              {inventory.title}
            </Typography>
            {inventory.isPublic ? (
                <Tooltip title="Public">
                  <Public color="success" />
                </Tooltip>
              ) : (
                <Tooltip title="Private">
                  <Lock color="action" />
                </Tooltip>
            )}
          </Box>
          <Typography 
            variant="body2" 
            sx={{
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto'
            }}
          >
            {inventory.description}
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Chip label={inventory.category.name} size="small" />
            <Typography variant="caption">
              {inventory.itemCount} items
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ width: 24, height: 24 }}>
                {inventory.createdBy.name.charAt(0)}
              </Avatar>
              <Typography variant="caption" >
                {inventory.createdBy.name}
              </Typography>
            </Box>
            <Typography variant="caption" >
              {formatDate(inventory.createdAt)}
            </Typography>
            
          </Box>
          {inventory.tags.length > 0 && (
            <Box display="flex" gap={1} flexWrap="wrap">
              {inventory.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
)}