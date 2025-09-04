import { Typography, Box, Alert, Button, CircularProgress, TextField, Avatar, Chip, IconButton, List, ListItem, ListItemText, Card } from '@mui/material';
import { InventoryDetail, InventoryUser, UserProfile } from '@intransition/shared-types';
import { FormEvent, useEffect, useState } from 'react';
import { AccessControlService } from '~services/Access/AccessControlService';
import { Delete, PersonAdd, } from '@mui/icons-material';
import { UserService } from '~services/User/UserService';
import { toast } from 'react-toastify';

interface Props {
  inventory: InventoryDetail;
}

export const AccessControl = ({ inventory }: Props) => {
    const [inventoryUsers, setInventoryUsers] = useState<InventoryUser[]>([]);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<boolean>(false);
    const [revokeLoading, setRevokeLoading] = useState<boolean>(false);

    useEffect(() => {
      fetchUsers();
    }, [inventory.id]);

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const inventoryUsersData = await AccessControlService.getInventoryUsers(inventory.id);
        const usersData = await UserService.getUsers();
        setInventoryUsers(inventoryUsersData.accesseUsersList);
        setUsers(usersData.users)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch inventory users');
      }
      setLoading(false);
    };

    const handleAddUser = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form)
      const email = formData.get('email');
      try {
        setActionLoading(true);
        setError(null);

        const user = users.find((user) => user.email === email);
        if (!user) {
          setError('User not found with this email address');
          form.reset();
          setActionLoading(false);
          return;
        }
        const data = await AccessControlService.grantAccess(inventory.id, { userId: user.id });
        setInventoryUsers((prev: InventoryUser[]) => prev ? [...prev, data.addedUser] : [data.addedUser]);
        form.reset();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to add user');
      }
        setActionLoading(false);
    };
      
    const handleRevokeAccess = async (id: string) => {
      try {
        setRevokeLoading(true);
        setError(null);
        const data = await AccessControlService.revokeAccess(inventory.id, { userId: id });
        setInventoryUsers((prev: InventoryUser[]) => prev ? prev.filter((user) => user.user.id !== data.id) : []);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to revoke access')
      }
        setRevokeLoading(false);
    };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4">Access control</Typography>
      <Typography>Manage who can access this inventory and their permissions.</Typography>
      <Box display="flex" flexDirection="column" gap={3}>
          {error && ( <Alert severity="error">{error}</Alert> )}

          <Box display="flex" flexDirection="column" gap={2} border={1} borderColor="divider" p={2}>

            <Typography variant="h6">
              <PersonAdd sx={{ mr: 1, verticalAlign: 'middle' }} />
              Add new editor
            </Typography>
            
            <Box component="form"onSubmit={handleAddUser} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <TextField
                label="User email"
                name="email"
                fullWidth
                disabled={actionLoading}
                type="email" 
                required
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ width: { xs: '100%', md: 200 } }}
                loading={actionLoading}
                startIcon={<PersonAdd />}
              >
                Add editor
              </Button>
            </Box>
          </Box>

          <Box>
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6">
                Users with access:
              </Typography>
                {inventoryUsers && Array.isArray(inventoryUsers) && inventoryUsers.map((userAccess:InventoryUser) => (
                  <Card key={userAccess.user.id}>
                    <ListItem>
                      <Avatar sx={{ mr: 2 }}>
                        {userAccess.user.name.charAt(0)}
                      </Avatar>
                      
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body1">
                              {userAccess.user.name}
                            </Typography>
                            <Chip 
                              label={userAccess.role.toLowerCase()}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={userAccess.user.email}
                      />
                      
                      {!userAccess.isOwner && (
                        <IconButton
                          edge="end"
                          onClick={() => handleRevokeAccess(userAccess.user.id)}
                          color="error"
                          loading={revokeLoading}
                          title="Remove editor access"
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </ListItem>
                  </Card>
                ))}
              </List>
            )}
          </Box>
        </Box>
    </Box>
  );
}