import { Box, Typography, Tabs, Tab } from "@mui/material";
import { AdminPanelSettings, Inventory } from "@mui/icons-material";

import { useState } from 'react';
import { UsersTab } from "./tabs/UsersTab";
import { InventoriesTab } from "./tabs/InventoriesTab";


export const AdminPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box display="grid" gap={2}>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h4" component="h1">
          Admin panel
        </Typography>
        <Typography variant="h6" component="h4">
          Manage Users and Inventories
        </Typography>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin panel tabs">
        <Tab value={0} label="Users" icon={<AdminPanelSettings />} />
        <Tab value={1} label="Inventories" icon={<Inventory />} />
      </Tabs>

      {tabValue === 0 ? <UsersTab /> : <InventoriesTab />}
    </Box>
  );
};