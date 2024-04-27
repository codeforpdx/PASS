import { createTheme } from '@mui/material/styles';
import RedHatDisplay from './fonts/RedHatDisplay-Italic-VariableFont_wght.ttf';
import RedHatText from './fonts/RedHatText-Italic-VariableFont_wght.ttf';

// theming from Figma

const theme = createTheme({
  typography: {
    button: {
      textTransform: 'none',
      fontWeight: 600
    },
    // old font family
    fontFamily: 'RedHatText, sans-serif',
    // new font family
    brand: { fontFamily: 'RedHatDisplay, sans-serif' },
    text: { fontFamily: 'RedHatText, sans-serif' }
  },
  palette: {
    primary: {
      // new primary themes
      strong: '#03295E',
      background: '#DDECFD',
      main: '#0758CA',
      text: 'black',

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
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'RedHatDisplay';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('RedHatDisplay'), local('RedHatDisplay-Regular'), url(${RedHatDisplay}) format('ttf');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
        @font-face {
          font-family: 'RedHatText';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('RedHatText'), local('RedHatText-Regular'), url(${RedHatText}) format('ttf');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `
    },
    MuiAlert: {
      styleOverrides: {
        filledSuccess: {
          backgroundColor: '#27826B',
          color: 'white'
        },
        filledError: {
          backgroundColor: '#D3403D',
          color: 'white'
        },
        filledWarning: {
          backgroundColor: '#E9A033',
          color: 'white'
        },
        filledInfo: {
          backgroundColor: 'blue',
          color: 'white'
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
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
