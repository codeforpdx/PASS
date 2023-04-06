import * as React from 'react';
// import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import theme from '../../theme';

const AppFooter = (props) => (
  <ThemeProvider theme={theme}>
    {/* <CssBaseline /> */}
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{
        backgroundColor: 'white',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        marginBottom: '20px',
        marginTop: '20px',
        padding: '10 10 10 10'
      }}
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://www.codeforpdx.org/">
        codeForPDX
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  </ThemeProvider>
);

export default AppFooter;
