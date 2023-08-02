// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

// Links for component
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

/**
 * @typedef {import("../../typedefs.js").footerProps} footerProps
 */

/**
 * The RenderCompanyInfoSection component renders information about policy,
 * terms and conditions, and the site to Code for PDX
 *
 * @param {footerProps} isReallySmallScreen - The props for footer sub-component
 * @returns {React.JSX.Element} The RenderCompanyInfoSection component
 */
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

export default RenderCompanyInfoSection;
