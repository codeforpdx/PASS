import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: { fontFamily: 'Roboto, sans-serif' },
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
  },
  // color properties TBD for status snackbar severieties
  components: {
    MuiAlert: {
      styleOverrides: {
        filledSuccess: {
          backgroundColor: 'green',
          color: 'white'
        },
        filledError: {
          backgroundColor: '#e53e3e',
          color: 'white'
        },
        filledWarning: {
          backgroundColor: 'orange',
          color: 'white'
        },
        filledInfo: {
          backgroundColor: 'blue',
          color: 'black'
        }
      }
    },
    
  },
});

export default theme;
