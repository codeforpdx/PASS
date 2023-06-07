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
const RenderCallToActionSection = ({ isReallySmallScreen }) => (
  <Stack width={isReallySmallScreen ? 1 : 3 / 5} alignItems="center" justifyContent="center">
    <Typography variant="h5" color="tertiary.main">
      Want to partner with PASS?
    </Typography>
    <Typography variant="body1" color="#fff" sx={{ width: 3 / 4 }}>
      If your organization is interested in partnering with PASS and would like to discuss further,
      contact us below.
    </Typography>
    <Button variant="contained" color="secondary" sx={{ my: '1rem', width: 1 / 2 }}>
      Proposal
    </Button>
  </Stack>
);

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

// middle section of footer
const RenderCompanyInfoSection = ({ isReallySmallScreen }) => (
  <Stack
    width={isReallySmallScreen ? 1 : 1 / 5}
    spacing={2}
    justifyContent="space-around"
    alignItems="center"
  >
    <Box>
      <Typography color="tertiary.main">PASS LOGO</Typography>
      <Typography color="#fff">tagline</Typography>
    </Box>
    <Box>
      <Typography color="tertiary.main">Follow Us</Typography>
      <Stack direction="row" spacing={1}>
        {socialLinks.map(({ href, icon }) => (
          <Link key={href} href={href} target="_blank" rel="noopener" color="#fff">
            {icon}
          </Link>
        ))}
      </Stack>
    </Box>
    <Box>
      <Typography color="tertiary.main">Built By:</Typography>
      <Link href="https://www.codeforpdx.org/" target="_blank" rel="noopener">
        <Typography variant="body2" color="#fff">
          C4PDX LOGO
        </Typography>
      </Link>
    </Box>
  </Stack>
);

const legalLinks = [
  {
    href: 'https://www.codeforpdx.org/',
    title: 'Privacy Policy'
  },
  {
    href: 'https://www.codeforpdx.org/',
    title: 'Terms and Conditions'
  },
  {
    href: 'https://www.codeforpdx.org/',
    target: '_blank',
    rel: 'noopenner',
    ml: 0.5,
    text: `©${new Date().getFullYear()}`,
    title: 'Code for PDX'
  }
];

// bottom section of footer
const RenderCopyrightAndLinksSection = ({ isReallySmallScreen }) => (
  <Stack
    orientation="column"
    width={isReallySmallScreen ? 1 : 1 / 5}
    spacing={2}
    justifyContent="space-around"
  >
    {legalLinks.map((link) => (
      <Typography key={link.title} variant="body2" color="tertiary.main">
        {link.text ?? null}
        <Link
          href={link.href}
          underline="none"
          color="tertiary.main"
          target={link.target ?? null}
          rel={link.rel ?? null}
          ml={link.ml ?? null}
        >
          {link.title}
        </Link>
      </Typography>
    ))}
  </Stack>
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
      mt={3}
      py={5}
      sx={{
        position: 'sticky',
        top: '100%',
        textAlign: 'center',
        bgcolor: 'primary.main'
      }}
    >
      <Container maxWidth={isSmallScreen ? 'md' : 'lg'}>
        <Stack
          alignItems="center"
          direction={isReallySmallScreen ? 'column' : 'row'}
          spacing={isSmallScreen ? 1 : 4}
          divider={
            <Divider
              orientation={isReallySmallScreen ? 'horizontal' : 'vertical'}
              flexItem={isReallySmallScreen ? null : true}
              color={theme.palette.tertiary.main}
              sx={isReallySmallScreen ? { height: '3px', width: 3 / 4 } : { width: '3px' }}
            />
          }
        >
          <RenderCallToActionSection isReallySmallScreen={isReallySmallScreen} />
          <RenderCompanyInfoSection isReallySmallScreen={isReallySmallScreen} />
          <RenderCopyrightAndLinksSection isReallySmallScreen={isReallySmallScreen} />
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
