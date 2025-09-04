import { IconButton, Tooltip } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useTheme } from '~context/ThemeContext';

export const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to dark mode'}>
      <IconButton
        onClick={toggleTheme}
        size='medium'
        sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
      >
        {mode === 'light' ? <DarkMode htmlColor="#6ea7f2" /> : <LightMode htmlColor="#edcc07" />}
      </IconButton>
    </Tooltip>
  );
};