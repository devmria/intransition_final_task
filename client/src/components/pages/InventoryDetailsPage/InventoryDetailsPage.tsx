import { Box, Typography, Tabs, Tab, Alert, Button, Breadcrumbs, Link } from '@mui/material'; 
import { ArrowBack, Inventory as InventoryIcon, Chat, Settings, Security, Build, Assignment, Analytics } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { CustomID } from '~components/pages/InventoryDetailsPage/Tabs/CustomID/CustomID';
import { InventoryDiscussion } from '~components/pages/InventoryDetailsPage/Tabs/Discussion/InventoryDiscussion';
import { InventoryFields } from '~components/pages/InventoryDetailsPage/Tabs/InventoryFields/InventoryFields';
import { InventoryItems } from '~components/pages/InventoryDetailsPage/Tabs/Items/InventoryItems';
import { InventorySettings } from '~components/pages/InventoryDetailsPage/Tabs/Settings/InventorySettings';
import { Statistics } from '~components/pages/InventoryDetailsPage/Tabs/Statistics/Statistics';
import { useAuth } from '~context/AuthContext';
import { InventoryService } from '~services/Inventory/InventoryService';
import { InventoryDetail } from '@intransition/shared-types';
import { SkeletonCard } from '~components/atoms/skeletons/SkeletinCard';
import { InventoryCard } from '~components/molecules/InventoryCard';
import { AccessControl } from '~components/pages/InventoryDetailsPage/Tabs/AccessControl/AccessControl';

export const InventoryDetailsPage = () => {
  const { inventoryId } = useParams<{ inventoryId: string }>();
  const navigate = useNavigate();
  
  const [inventory, setInventory] = useState<InventoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const { user } = useAuth(); 

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    if (!inventoryId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await InventoryService.getInventory(inventoryId);
      setInventory(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch inventory');
    }
    setLoading(false);
  };

  const isOwner = (inventory?.createdBy.id === user?.id) ? true : false;
  const isEditor = (inventory?.editors.find((editor) => editor.id === user?.id) ? true : false)
  const isInventoryToolsAllowed = isOwner || user?.isAdmin || isEditor;

  if (loading) {
    return <SkeletonCard/>
  }

  if (error) {
    return (
      <Box maxWidth="md">
        <Box >
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />}
            onClick={() => navigate('/inventories')}
          >
            Back to Inventories
          </Button>
        </Box>
      </Box>
    );
  }

  if (!inventory) {
    return (
      <Box maxWidth="md">
        <Alert severity="error" sx={{ mb: 3 }}>Inventory not found</Alert>
        <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate('/inventories')}>Back to Inventories</Button>
      </Box>
    );
  }

  return (
    <Box maxWidth="lg">
      <Box >
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/" underline="hover">Home</Link>
          <Link component={RouterLink} to="/inventories" underline="hover">Inventories</Link>
          <Typography color="text.primary">{inventory.title}</Typography>
        </Breadcrumbs>

        <InventoryCard inventory={inventory} />

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={currentTab} 
            onChange={(_, value) => setCurrentTab(value)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<InventoryIcon />} label="Items" />
            <Tab icon={<Chat />} label="Discussion" />
            <Tab icon={<Settings />} label="Settings" disabled={!isInventoryToolsAllowed} />
            <Tab icon={<Security />} label="Access control" disabled={!isInventoryToolsAllowed} />
            <Tab icon={<Build />} label="Custom IDs" disabled={!isInventoryToolsAllowed} />
            <Tab icon={<Assignment />} label="Fields" disabled={!isInventoryToolsAllowed} />
            <Tab icon={<Analytics />} label="Statistics" />
          </Tabs>
        </Box>

        {currentTab === 0 && (
          <InventoryItems 
            inventory={inventory} 
          />
        )}
        {currentTab === 1 && (
          <InventoryDiscussion 
            inventory={inventory} 
          />
        )}
        {currentTab === 2 && (
          <InventorySettings 
            inventory={inventory} 
            onChange={setInventory}
          />
        )}
        {currentTab === 3 && (
          <AccessControl 
            inventory={inventory} 
          />
        )}
        {currentTab === 4 && (
          <CustomID 
            inventory={inventory} 
          />
        )}
        {currentTab === 5 && (
          <InventoryFields 
            inventory={inventory} 
          />
        )}
        {currentTab === 6 && (
          <Statistics 
            inventory={inventory} 
          />
        )}
        
      </Box>
  
    </Box>
  );
};