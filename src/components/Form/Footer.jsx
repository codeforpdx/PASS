import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const Footer = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column'
    }}
  >
    <CssBaseline />
    <Box
      component="footer"
      sx={{
        py: 1,
        px: 2,
        mt: 'auto',
        textAlign: 'center'
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body1">footer details</Typography>
        <Typography variant="body2" color="text.secondary">
          {'Copyright © '}
          <Link color="inherit" href="https://www.codeforpdx.org/" target="_blank">
            codeForPDX
          </Link>{' '}
          {new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  </Box>
);

export default Footer;
