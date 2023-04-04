import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

// const AppFooter = (props) => (
//   <Typography
//     variant="body2"
//     color="text.secondary"
//     align="center"
//     sx={{ 
//       position: 'fixed',
//       bottom: 0,
//       left: 0,
//       right: 0,
//       marginBottom: '20px',
//       marginTop: '20px',
//       padding: '10 10 10 10'
//     }}
//     {...props}
//   >
//     {'Copyright © '}
//     <Link color="inherit" href="https://github.com/codeforpdx/PASS">
//       codeForPDX
//     </Link>{' '}
//     {new Date().getFullYear()}
//   </Typography>
// );

const Copyright = () => {
  <Typography variant="body2" color="text.secondary">
    {'Copyright © '}
    <Link color="inherit" href="https://github.com/codeforpdx/PASS">
      codeForPDX
    </Link>
    {new Date().getFullYear()}
    '.'
  </Typography>;
};

const Footer = () => {
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}
  >
    <CssBaseline />
    <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
      <Typography variant="h2" component="h1" gutterBottom>
        Sticky footer
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        'Pin a footer to the bottom of the viewport.' <br /> 'The footer will move as the main
        element of the page grows.'
      </Typography>
      <Typography variant="body1">Sticky footer placeholder.</Typography>
    </Container>
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800]
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body1">My sticky footer can be found here.</Typography>
        <Copyright />
      </Container>
    </Box>
  </Box>;
};

export default Footer;
