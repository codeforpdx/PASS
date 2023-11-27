import { createTheme } from '@mui/material/styles';

const themePalettePrimaryMain = '#017969';
const themePalettePrimarySlight = '#8fc2bb';

const theme = createTheme({
  typography: { fontFamily: 'Roboto, sans-serif' },
  palette: {
    primary: {
      light: '#039686',
      main: themePalettePrimaryMain,
      dark: '#004d3e',
      slight: themePalettePrimarySlight,
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
  // color properties TBD for status snackbar severities
  components: {
    MuiAlert: {
      styleOverrides: {
        filledSuccess: {
          backgroundColor: 'green',
          color: 'white'
        },
        filledError: {
          backgroundColor: 'red',
          color: 'white'
        },
        filledWarning: {
          backgroundColor: 'orange',
          color: 'white'
        },
        filledInfo: {
          backgroundColor: 'blue',
          color: 'white'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: themePalettePrimaryMain,
          color: '#fff'
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td, &:last-child th': {
            border: 0
          },
          '&:nth-of-type(even)': {
            backgroundColor: themePalettePrimarySlight
          }
        }
      }
    }
  }
});

export default theme;
