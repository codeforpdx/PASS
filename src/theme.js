import { createTheme } from '@mui/material/styles';

const themePalettePrimaryMain = '#0758CA';
const themePalettePrimarySlight = '#8fc2bb';

const theme = createTheme({
  typography: { fontFamily: 'Red Hat Display, Red Hat Text' },
  palette: {
    primary: {
      light: '#D3E7FD',
      main: themePalettePrimaryMain,
      dark: '#03295E',
      slight: themePalettePrimarySlight,
      contrastText: '#fff'
    },
    secondary: {
      light: '#F8F1ED',
      main: '#DC562E',
      dark: '#321C15',
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
    },
    accessible: {
      main: '#fff',
      contrastText: themePalettePrimaryMain
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
