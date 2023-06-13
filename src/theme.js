import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: { fontFamily: 'Roboto, sans-serif' },
  breakpoints: {
    values: {
      xxs: 0,
      xs: 300,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  },
  palette: {
    primary: {
      light: '#039686',
      main: '#017969',
      dark: '#004d3e',
      slight: '#8fc2bb',
      contrastText: '#fff'
    },
    secondary: {
      light: '#b32126',
      main: '#961020',
      dark: '#790111',
      contrastText: '#fff'
    },
    tertiary: {
      light: '#dbc584',
      main: '#DEBC59',
      dark: '#dbb032',
      contrastText: '#fff'
    },
    status: {
      danger: '#e53e3e'
    },
    neutral: {
      main: '#64748B',
      contrastText: '#fff'
    }
  }
});

export default theme;
