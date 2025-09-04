import { SignInForm } from '~components/molecules/SignInForm';
import { useAuth } from '~context/AuthContext';
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import { Navigate } from 'react-router-dom';

export const LoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Box sx={{ width: '100%', mb: {width: 600, padding: 20} }}>
          <Box textAlign="center" mb={4}>
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              component="h1" 
              gutterBottom
              color="primary"
              fontWeight="bold"
            >
              Inventory System
            </Typography>
            <Typography variant="h6">
              Sign in to your account
            </Typography>
          </Box>
          {isMobile 
            ? <SignInForm />
            : <Paper elevation={3} sx={{ p: 4, widht: '100%' }}><SignInForm /></Paper>
          }
        </Box>
      </Box>
    </Box>
  );
};