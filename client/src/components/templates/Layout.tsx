import { NavigationBar } from '~components/organismus/NavigationBar';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { SkeletonLayout } from '~components/atoms/skeletons/SkeletonLayout';

interface LayoutProps {
  loading?: boolean;
}

export const Layout = ({ loading = false }: LayoutProps) => {
  if (loading) {
    return <SkeletonLayout />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavigationBar />
      
      <Box component="main" maxWidth="xl"
        sx={{ flexGrow: 1, p: 4 }}
      >
        <Outlet />
      </Box>
      
      <Box
        component="footer"
        sx={{ display: 'flex', flexDirection: 'column', minHeight: 100 }}
      >
      </Box>
    </Box>
  );
};