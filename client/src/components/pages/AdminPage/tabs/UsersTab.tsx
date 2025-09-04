import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Chip, IconButton, Tooltip, Card, CardContent } from "@mui/material";
import { Delete, LockOpen, AdminPanelSettings, RemoveModerator } from "@mui/icons-material";
import LockIcon from '@mui/icons-material/Lock';
import AddModeratorIcon from '@mui/icons-material/AddModerator';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UserService } from "~services/User/UserService";
import { useAuth } from "~context/AuthContext";
import { UserProfile } from "@intransition/shared-types";
import { SkeletonTableRow } from "~components/atoms/skeletons/SkeletonTableRow";
import { formatDate } from "~components/atoms/DateTools";
import { getStatusColor } from "~components/atoms/RolesTools";

export const UsersTab = () => {
  const { user: currentUser, logout } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await UserService.getUsers();
      setUsers(data.users);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error fetch users');
    } 
    setLoading(false);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(users.map(user => user.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelected(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleDelete = async () => {
    if (selected.length === 0) return;
    try {
      await UserService.deleteUsers(selected);
      if (currentUser?.id && selected.includes(currentUser.id)) {
        toast.success('Your account has been deleted');
        logout();
        return;
      }
      toast.success(`Successfully deleted ${selected.length} user(s)`);
      await fetchUsers();
      setSelected([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to delete users`);
    }
  };

  const handleBlock = async () => {
    if (selected.length === 0) return;
    try {
      await UserService.blockUsers(selected);
      if (currentUser?.id && selected.includes(currentUser.id)) {
        toast.success('Your account has been blocked');
        logout();
        return;
      }
      toast.success(`Successfully blocked ${selected.length} user(s)`);
      await fetchUsers();
      setSelected([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to block users');
    }
  };

  const handleMakeAdmin = async() => {
    if (selected.length === 0) return;
    try {
      await UserService.makeAdminUsers(selected)
      toast.success(`Successfully set "admin" role to ${selected.length} user(s)`);
      await fetchUsers();
      setSelected([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add "admin" role');
    }
  }

  const handleRemoveAdmin = async() => {
    if (selected.length === 0) return;
    try {
      await UserService.removeAdminUsers(selected)
      toast.success(`Successfully removed "admin" role to ${selected.length} user(s)`);
      await fetchUsers();
      setSelected([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove admin status');
    }
  }

  const handleUnblock = async () => {
    if (selected.length === 0) return;
    try {
      await UserService.unblockUsers(selected);
      toast.success(`Successfully unblocked ${selected.length} user(s)`);
      await fetchUsers();
      setSelected([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to unblock users');
    }
  };

  return (
    <Box display="grid" gap={2}>
      <Box display="grid" gap={2}>
        <Typography variant="body2">
          {loading ? 'Loading...' : `${users.length} users found`}
        </Typography>

        {selected.length > 0 && (
          <Card variant="outlined">
              <Typography variant="h6" p={1}>
                {selected.length} user(s) selected
              </Typography>

            <CardContent sx={{ display: 'flex', flexWrap: 'wrap', gap: {xs: 1, sm: 3}, justifyContent: 'flex-start'}} >
              <Tooltip title="Delete users">
                <IconButton onClick={handleDelete} color="error" size="small">
                  <Delete sx={{mr: 1}}/>
                  Delete
                </IconButton>
              </Tooltip>

              <Tooltip title="Block users">
                <IconButton onClick={handleBlock} size="small">
                  <LockIcon sx={{mr: 1}}/>
                  Block
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Unblock users">
                <IconButton onClick={handleUnblock} size="small">
                  <LockOpen sx={{mr: 1}}/>
                  Unblock
                </IconButton>
              </Tooltip>
            
              <Tooltip title="Grant admin rights">
                <IconButton onClick={handleMakeAdmin} size="small">
                  <AddModeratorIcon sx={{mr: 1}}/>
                  Make an admin
                </IconButton>
              </Tooltip>

              <Tooltip title="Revoke admin rights">
                <IconButton onClick={handleRemoveAdmin} size="small">
                  <RemoveModerator sx={{mr: 1}}/>
                  Remove an admin
                </IconButton>
              </Tooltip>
            </CardContent>
          </Card>
        )}

      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < users.length}
                  checked={users.length > 0 && selected.length === users.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonTableRow key={index} amount={6} />
                ))
              : users.map((user) => {
                  const isSelected = selected.includes(user.id);
                  return (
                    <TableRow 
                      key={user.id} 
                      hover 
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelectItem(user.id) }
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <AdminPanelSettings color="error" fontSize="small" />
                          <Typography variant="body2" fontWeight="medium">
                            {user.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" >
                          {formatDate(user.lastLoginAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          size="small"
                          color={getStatusColor(user.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isAdmin ? 'Admin' : 'User'}
                          size="small"
                          color={user.isAdmin ? 'error' : 'default'}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && users.length === 0 && (
        <Box textAlign="center" py={6}>
          <Typography variant="h6" gutterBottom>
            No users found
          </Typography>
          <Typography variant="body2">
            There are no users in the system.
          </Typography>
        </Box>
      )}
    </Box>
  );
};