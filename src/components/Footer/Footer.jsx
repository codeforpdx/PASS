// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// Material Icons Imports
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        position: 'sticky',
        top: '100%',
        textAlign: 'center',
        bgcolor: `${theme.palette.primary.main}`
      }}
      py={5}
    >
      <Container maxWidth="lg">
        <Grid container columnSpacing={0} my={2}>
          <Grid item xs={7} sx={{borderRight: 2, borderColor: theme.palette.tertiary.main, pr: 12}}>
            <Typography variant="h5" color={`${theme.palette.tertiary.main}`}>
              Want to partner with PASS?
            </Typography>
            <Typography variant="body1" color="#fff">
              If your organization is interested in partnering with PASS and would like to discuss
              further, contact us below.
            </Typography>
            <Button variant="contained" color="secondary" sx={{ my: '1rem' }}>
              Partnership Proposal
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Typography color={`${theme.palette.tertiary.main}`}>PASS LOGO</Typography>
            <Typography color="#fff" mb={5}>tagline</Typography>
            <Typography color={`${theme.palette.tertiary.main}`}>Follow Us</Typography>
            <Link href="https://twitter.com/" target="_blank" rel="noopener" color="#fff" mr={1}>
              <TwitterIcon />
            </Link>
            <Link href="https://www.facebook.com/" target="_blank" rel="noopener" color="#fff">
              <FacebookIcon />
            </Link>
            <Link
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener"
              color="#fff"
              ml={1}
            >
              <InstagramIcon />
            </Link>
          </Grid>
          <Grid item xs={2}>
            <Typography color={`${theme.palette.tertiary.main}`}>Built By:</Typography>
            <Link
              href="https://www.codeforpdx.org/"
              target="_blank"
              rel="noopener"
              underline="none"
            >
              <Typography variant="body2" color="#fff">
                C4PDX LOGO
              </Typography>
            </Link>
            <Typography variant="body2" color={`${theme.palette.tertiary.main}`} mb={5}>
              ©{new Date().getFullYear()}{' '}
              <Link
                href="https://www.codeforpdx.org/"
                target="_blank"
                rel="noopener"
                underline="none"
                color={`${theme.palette.tertiary.main}`}
              >
                Code for PDX
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link
                href="https://www.codeforpdx.org/"
                underline="none"
                color="#fff"
              >
                Privacy Policy
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link
                href="https://www.codeforpdx.org/"
                underline="none"
                color="#fff"
              >
                Terms and Conditions
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
