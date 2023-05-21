// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Material Icons Imports
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

// top section of footer
const RenderCallToActionSection = ({ theme }) => (
  <Box>
    <Typography variant="h5" color={theme.palette.tertiary.main}>
      Want to partner with PASS?
    </Typography>
    <Typography variant="body1" color="#fff">
      If your organization is interested in partnering with PASS and would like to discuss further,
      contact us below.
    </Typography>
    <Button variant="contained" color="secondary" sx={{ my: '1rem' }}>
      Partnership Proposal
    </Button>
  </Box>
);

// middle section of footer
const RenderCompanyInfoSection = ({ theme, isReallySmallScreen, isSmallScreen }) => {
  const socialLinks = [
    {
      href: 'https://twitter.com/',
      icon: <TwitterIcon />
    },
    {
      href: 'https://www.facebook.com/',
      icon: <FacebookIcon />
    },
    {
      href: 'https://www.instagram.com/',
      icon: <InstagramIcon />
    }
  ];

  return (
    <Box>
      <Stack
        direction={isReallySmallScreen ? 'column' : 'row'}
        spacing={isSmallScreen ? 4 : 12}
        justifyContent="space-around"
        alignItems="center"
      >
        <Stack>
          <Typography color={theme.palette.tertiary.main}>PASS LOGO</Typography>
          <Typography color="#fff">tagline</Typography>
        </Stack>
        <Stack>
          <Typography color={theme.palette.tertiary.main}>Follow Us</Typography>
          <Stack direction="row" spacing={1}>
            {socialLinks.map(({ href, icon }) => (
              <Link key={href} href={href} target="_blank" rel="noopener" color="#fff">
                {icon}
              </Link>
            ))}
          </Stack>
        </Stack>
        <Stack>
          <Typography color={theme.palette.tertiary.main}>Built By:</Typography>
          <Link href="https://www.codeforpdx.org/" target="_blank" rel="noopener">
            <Typography variant="body2" color="#fff">
              C4PDX LOGO
            </Typography>
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
};

// bottom section of footer
const RenderCopyrightAndLinksSection = ({ theme, isSmallScreen }) => (
  <Box>
    <Stack
      direction={isSmallScreen ? 'column-reverse' : 'row'}
      spacing={2}
      justifyContent="space-between"
      divider={
        <Divider
          color={theme.palette.tertiary.main}
          sx={{ display: { xs: 'flex', md: 'none' }, height: '3px' }}
        />
      }
    >
      <Typography variant="body2" color={theme.palette.tertiary.main}>
        ©{new Date().getFullYear()}
        <Link
          href="https://www.codeforpdx.org/"
          target="_blank"
          rel="noopener"
          underline="none"
          color={theme.palette.tertiary.main}
          ml={0.5}
        >
          Code for PDX
        </Link>
      </Typography>
      <Stack
        direction={isSmallScreen ? 'column' : 'row'}
        spacing={isSmallScreen ? 0 : 2}
        divider={<Divider color={theme.palette.tertiary.main} orientation="vertical" flexItem />}
      >
        <Typography variant="body2">
          <Link
            href="https://www.codeforpdx.org/"
            underline="none"
            color={theme.palette.tertiary.main}
          >
            Privacy Policy
          </Link>
        </Typography>
        <Typography variant="body2">
          <Link
            href="https://www.codeforpdx.org/"
            underline="none"
            color={theme.palette.tertiary.main}
          >
            Terms and Conditions
          </Link>
        </Typography>
      </Stack>
    </Stack>
  </Box>
);

/**
 * Footer Component - Footer Component for PASS
 *
 * @memberof Footer
 * @name Footer
 */

const Footer = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isReallySmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component="footer"
      sx={{
        position: 'sticky',
        top: '100%',
        textAlign: 'center',
        bgcolor: theme.palette.primary.main
      }}
      py={5}
    >
      <Container maxWidth={isSmallScreen ? 'sm' : 'lg'}>
        <Stack
          spacing={2}
          divider={<Divider color={theme.palette.tertiary.main} sx={{ height: '3px' }} />}
        >
          <RenderCallToActionSection theme={theme} />
          <RenderCompanyInfoSection
            theme={theme}
            isSmallScreen={isSmallScreen}
            isReallySmallScreen={isReallySmallScreen}
          />
          <RenderCopyrightAndLinksSection theme={theme} isSmallScreen={isSmallScreen} />
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
