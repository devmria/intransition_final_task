import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Tooltip, MenuItem, Menu, useTheme, useMediaQuery } from '@mui/material';
import { Home, Inventory, AdminPanelSettings, Language, Person } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~context/AuthContext';
import { ThemeToggle } from '~components/molecules/ThemeToggle';
import MenuIcon from '@mui/icons-material/Menu';

export const NavigationBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [language, setLanguage] = useState<'en' | 'de'>('en');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  //TODO
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'de' : 'en');
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItem = (link: string) => {
    navigate(link); 
    handleClose();
  }

  const MobileMenu = () => {
    return (
      <div>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          color="inherit"
        >
          <MenuIcon />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            list: {
              'aria-labelledby': 'basic-button',
            },
          }}
        >
          <MenuItem onClick={() => handleMenuItem('/')}><Home sx={{mr: 1}}/>Main page</MenuItem>
          <MenuItem onClick={() => handleMenuItem('/inventories')}><Inventory sx={{mr: 1}}/>Inventories</MenuItem>
          {user && <MenuItem onClick={() => handleMenuItem(`/user/${user.id}`)}><Person sx={{mr: 1}}/>Profile</MenuItem>}
          {user && user.isAdmin && <MenuItem onClick={() => handleMenuItem('/admin')}><AdminPanelSettings sx={{mr: 1}}/>Admin</MenuItem>}
        </Menu>
      </div>
    );
  }

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" component="div" sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          LOGO
        </Typography>

        {isMobile ? <MobileMenu />
          :
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" startIcon={<Home />} onClick={() => navigate('/')}>
              Main page
            </Button>
            
            <Button color="inherit" startIcon={<Inventory />} onClick={() => navigate('/inventories')}>
              Inventories
            </Button>

            {
              user && 
              <Button color="inherit" startIcon={<Person />} onClick={() => navigate(`/user/${user.id}`)}>
                Profile
              </Button>
            }

            {user && user.isAdmin && (
              <Button color="inherit" startIcon={<AdminPanelSettings />} onClick={() => navigate('/admin')}>
                Admin
              </Button>
            )}
          </Box>
        }


        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title={`Switch to ${language === 'en' ? 'German' : 'English'}`}>
            <IconButton color="inherit" onClick={toggleLanguage}>
              <Language />
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {language.toUpperCase()}
              </Typography>
            </IconButton>
          </Tooltip>

          <ThemeToggle />

          {user ? (
            <>              
              <Tooltip title="Account">
                <IconButton onClick={() => navigate(`/user/${user.id}`)}>
                  <Avatar sx={{ width: 32, height: 32 }} alt={user.name}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate('/auth/login')}>
              LOGIN
            </Button>
          )}
        </Box>

      </Toolbar>
    </AppBar>
  );
};