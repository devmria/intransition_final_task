import { SignUpForm } from '~components/molecules/SignUpForm';
import { useAuth } from '~context/AuthContext';
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import { Navigate } from 'react-router-dom';

export const RegisterPage = () => {
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
          display: 'flex',
          width: '100vw',
          alignItems: 'center',
          justifyContent: 'center'
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
              Create your account
            </Typography>
          </Box>

          {isMobile 
            ? <SignUpForm />
            : <Paper elevation={3} sx={{ p: 4, widht: '100%' }}><SignUpForm /></Paper>
          }

        </Box>
      </Box>
    </Box>
  );
};