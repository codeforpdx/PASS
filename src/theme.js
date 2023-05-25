import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    // button: {
    //   fontStyle: 'italic'
    // },
    fontFamily: 'Roboto, sans-serif',
    dd: { fontWeight: 'bold' },
    dl: {
      display: 'grid',
      gridTemplateColumns: 'max-content auto'
    }
  },
  palette: {
    primary: {
      light: '#039686',
      main: '#017969',
      dark: '#004d3e',
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
