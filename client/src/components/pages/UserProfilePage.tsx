import { useAuth } from '~context/AuthContext';
import { UserService } from '~services/User/UserService';
import { AccountCircle, AdminPanelSettings, Add, Logout } from '@mui/icons-material';
import { Box, Typography, Grid, Card, CardContent, Avatar, Chip, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDate } from '~components/atoms/DateTools';
import { InventoryListItem, UserInventoryItem, UserProfile } from '@intransition/shared-types';
import { InventoriesTable } from '~components/molecules/InventoriesTable';
import { InventoryCreateDialog } from '~components/molecules/InventoryCreateDialog';
import { toast } from 'react-toastify';
import { SkeletonUserProfile } from '~components/atoms/skeletons/SkeletonUserProfile';

export const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser, logout, loading: actionLoading } = useAuth();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [ownedInventories, setOwnedInventories] = useState<UserInventoryItem[]>([]);
  const [accessibleInventories, setAccessibleInventories] = useState<UserInventoryItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId || !currentUser) return;
      
      try {
        setLoading(true);
        const [profile, ownedInventoriesData, accessibleInventoriesData] = await Promise.all([
          UserService.getUserProfile(userId),
          UserService.getUserOwnedInventories(userId),
          UserService.getUserAccessibleInventories(userId)
        ]);

        setProfileUser(profile);
        setOwnedInventories(ownedInventoriesData);
        setAccessibleInventories(accessibleInventoriesData);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Error get profile info');
      } setLoading(false);
    };
    fetchUserProfile();
  }, [userId, currentUser]);

  const handleCreateSuccess = (newInventory: InventoryListItem) => {
    setCreateDialogOpen(false);
    navigate(`/inventory/${newInventory.id}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!currentUser) {
    return (
      <Box maxWidth="md">
        <Typography variant="h4" color="error">
          Error loading profile
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <SkeletonUserProfile/>
    );
  }

  if (!profileUser) {
    return (
      <Box maxWidth="md">
        <Typography variant="h4" color="error">
          User not tound.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          The requested user profile could not be found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3} direction="row">
        <Grid container spacing={3} size={{ xs:12, md: 4}} direction="column">
          <Card>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                <Avatar sx={{ width: 60, height: 60}} alt={profileUser.name}>
                  {profileUser.name.charAt(0).toUpperCase()}
                </Avatar>
                
                <Typography variant="h5">
                  {profileUser.name}
                </Typography>
                
                <Typography variant="body2" >
                  {profileUser.email}
                </Typography>

                <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center" mb={2}>
                  <Chip
                    icon={<AccountCircle />}
                    label={profileUser.status}
                    color={profileUser.status === 'ACTIVE' ? 'success' : 'default'}
                    size="small"
                  />
                  {profileUser.isAdmin && (
                    <Chip
                      icon={<AdminPanelSettings />}
                      label="Admin"
                      color="error"
                      size="small"
                    />
                  )}
                </Box>

                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography variant="body2">
                    Member since: {formatDate(profileUser.createdAt)}
                  </Typography>
                  <Typography variant="body2" >
                    Last login: {formatDate(profileUser.lastLoginAt)}
                  </Typography>
                  <Button 
                    variant="outlined"
                    onClick={handleLogout} 
                    color="error"
                    loading={actionLoading}
                    startIcon={<Logout/>}  
                  >
                    Logout
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateDialogOpen(true)}
            >
            Create inventory
          </Button>
        </Grid>

        <Grid size={{xs:12, md:8}}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Owned Inventories ({ownedInventories.length})
              </Typography>
              
              {ownedInventories.length === 0 ? (
                <Typography variant="body2" >
                  No owned inventories yet.
                </Typography>
              ) : (
                <InventoriesTable isOwner={true} inventories={ownedInventories} setInventories={setOwnedInventories}/>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Accessible Inventories ({accessibleInventories.length})
              </Typography>
              
              {accessibleInventories.length === 0 ? (
                <Typography variant="body2" >
                  No accessible inventories.
                </Typography>
              ) : 
                <InventoriesTable isOwner={false} inventories={accessibleInventories} setInventories={setAccessibleInventories}/>
              }
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <InventoryCreateDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
      />

    </Box>
  );
};