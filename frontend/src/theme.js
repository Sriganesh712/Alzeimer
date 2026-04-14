import { createTheme } from '@mui/material/styles';

// Professional medical/healthcare color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Professional blue
      dark: '#0d47a1',
      light: '#42a5f5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0288d1', // Lighter medical blue
      dark: '#01579b',
      light: '#4fc3f7',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f7fa', // Soft light gray
      paper: '#ffffff',
    },
    text: {
      primary: '#263238',
      secondary: '#546e7a',
    },
    // Severity levels for predictions
    success: {
      main: '#4caf50', // Green for NonDemented
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800', // Orange for Moderate
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336', // Red for severe cases
      light: '#e57373',
      dark: '#d32f2f',
    },
    info: {
      main: '#ffc107', // Yellow for Mild
      light: '#ffd54f',
      dark: '#ffa000',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
      fontSize: '2.5rem',
      letterSpacing: '-0.01562em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    button: {
      textTransform: 'none', // Less aggressive button text
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12, // Softer, more modern corners
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 6px 12px rgba(0,0,0,0.1)',
    '0px 8px 16px rgba(0,0,0,0.12)',
    '0px 10px 20px rgba(0,0,0,0.14)',
    '0px 12px 24px rgba(0,0,0,0.16)',
    '0px 14px 28px rgba(0,0,0,0.18)',
    '0px 16px 32px rgba(0,0,0,0.2)',
    '0px 18px 36px rgba(0,0,0,0.22)',
    '0px 20px 40px rgba(0,0,0,0.24)',
    '0px 22px 44px rgba(0,0,0,0.26)',
    '0px 24px 48px rgba(0,0,0,0.28)',
    '0px 26px 52px rgba(0,0,0,0.3)',
    '0px 28px 56px rgba(0,0,0,0.32)',
    '0px 30px 60px rgba(0,0,0,0.34)',
    '0px 32px 64px rgba(0,0,0,0.36)',
    '0px 34px 68px rgba(0,0,0,0.38)',
    '0px 36px 72px rgba(0,0,0,0.4)',
    '0px 38px 76px rgba(0,0,0,0.42)',
    '0px 40px 80px rgba(0,0,0,0.44)',
    '0px 42px 84px rgba(0,0,0,0.46)',
    '0px 44px 88px rgba(0,0,0,0.48)',
    '0px 46px 92px rgba(0,0,0,0.5)',
    '0px 48px 96px rgba(0,0,0,0.52)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: '0px 3px 6px rgba(0,0,0,0.12)',
          '&:hover': {
            boxShadow: '0px 6px 12px rgba(0,0,0,0.18)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove MUI gradient
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
        },
        elevation2: {
          boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

// Helper function to get color based on prediction label
export const getSeverityColor = (label) => {
  switch (label) {
    case 'NonDemented':
      return theme.palette.success.main;
    case 'VeryMildDemented':
      return theme.palette.info.main;
    case 'MildDemented':
      return theme.palette.info.main;
    case 'ModerateDemented':
      return theme.palette.warning.main;
    default:
      return theme.palette.primary.main;
  }
};

export default theme;
