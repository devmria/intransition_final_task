import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { AuthRoute } from './routes';
import { AuthProvider } from 'context/AuthContext';
import { ThemeProvider, useTheme } from 'context/ThemeContext';
import { lightTheme, darkTheme } from 'theme/theme';
import { CategoriesProvider } from '~context/CategoryContext';

const AppContent = () => {
  const { mode } = useTheme();
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <CategoriesProvider>
            <AuthRoute />
          </CategoriesProvider>
        </AuthProvider>
      </BrowserRouter>
    </MuiThemeProvider>
  );
};

export const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}