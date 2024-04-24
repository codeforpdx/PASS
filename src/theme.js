import { createTheme } from '@mui/material/styles';

// theming from Figma

const theme = createTheme({
  typography: { fontFamily: 'Roboto, sans-serif' },
  palette: {
    primary: {
      // new primary themes
      strong: '#03295E',
      background: '#DDECFD',
      main: '#0758CA',

      // old primary themes
      dark: '#004d3e',
      light: '#039686',
      slight: '#03295E',
      contrastText: '#fff'
    },
    secondary: {
      // new seconday theming
      weak: '#FFD4C8',
      main: '#DB562E',
      strong: '#822E15',

      // old themes
      light: '#b32126',
      dark: '#790111',
      contrastText: '#fff'
    },
    // tertiary old theme
    tertiary: {
      light: '#dbc584',
      main: '#DEBC59',
      dark: '#dbb032',
      contrastText: '#fff'
    },
    status: {
      // danger theme is old
      danger: '#e53e3e',
      // error, success, warning new themes
      error: {
        main: '#D3403D',
        weak: '#FFDEDE',
        strong: '#AB2927'
      },
      success: {
        weak: '#DCF2ED',
        main: '#27826B',
        strong: '#056148'
      },
      warning: {
        weak: '#FCEFCF',
        main: '#E9A033',
        strong: '#9E5F00'
      }
    },
    // background new theme
    background: {
      main: '#FFFFFF',
      tint: '#EEE8E2',
      light: '#FAF7F5'
    },
    // content new theme
    content: {
      disabled: '#9C948F',
      weak: '#786965',
      main: '#4F3D37',
      strong: '#321C15',
      reverse: '#FFFEFC'
    },
    // border new theme
    border: {
      weak: '#C2BBB6',
      strong: '#918C88'
    },
    // neutral old theme
    neutral: {
      main: '#64748B',
      contrastText: '#fff'
    },
    // accessible old theme
    accessible: {
      main: '#fff',
      contrastText: '#0758CA'
    }
  },
  // color properties TBD for status snackbar severities
  // LOOK INTO THESE
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
          backgroundColor: '#0758CA',
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
            backgroundColor: '#0758CA'
          }
        }
      }
    }
  }
});

export default theme;
