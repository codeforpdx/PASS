// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SvgIcon from '@mui/material/SvgIcon';

// New Twitter Icon
const TwitterIcon = () => (
  <SvgIcon
    viewBox="0 0 512 512"
    sx={{ width: '1.25em', height: '1.25em' }}
    titleAccess="Twitter logo"
  >
    <path
      d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
      fill="primary"
    />
  </SvgIcon>
);

// Links for component
const socialLinks = [
  {
    name: 'Twitter',
    href: 'https://twitter.com/',
    icon: <TwitterIcon />
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/',
    icon: <FacebookIcon fontSize="large" titleAccess="Facebook logo" />
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/',
    icon: <InstagramIcon fontSize="large" titleAccess="Instagram logo" />
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/code-pdx/',
    icon: <LinkedInIcon fontSize="large" titleAccess="LinkedIn logo" />
  }
];

/**
 * RenderCompanyInfoSection - Component renders information about policy,
 * terms and conditions, and the site to CODE PDX
 *
 * @memberof Footer
 * @name RenderCompanyInfoSection
 * @param {object} Props - The props for footer sub-component
 * @param {boolean} Props.isReallySmallScreen - Boolean for if screen is below theme
 * breakdown of 'sm' for MUI
 * @returns {React.JSX.Element} The RenderCompanyInfoSection component
 */
const RenderCompanyInfoSection = ({ isReallySmallScreen }) => (
  <Stack width={isReallySmallScreen ? 1 : 1 / 5} justifyContent="space-between" alignItems="center">
    <Box>
      <Typography color="primary.strong" variant="h5" component="h2" mb={1}>
        Connect
      </Typography>
      <Stack direction="row" spacing={isReallySmallScreen ? 3 : 2} alignItems="center">
        {socialLinks.map(({ href, icon, name }) => (
          <Link
            key={href}
            href={href}
            target="_blank"
            rel="noopener"
            color="primary"
            aria-label={`Follow us on ${name}`}
          >
            {icon}
          </Link>
        ))}
      </Stack>
    </Box>
  </Stack>
);

export default RenderCompanyInfoSection;
