// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import SvgIcon from '@mui/material/SvgIcon';

// new Twitter Icon
const TwitterIcon = () => (
  <SvgIcon
    viewBox="0 0 512 512"
    sx={{ width: '1.25em', height: '1.25em' }}
    titleAccess="Twitter logo"
  >
    <path
      d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
      fill="#fff"
    />
  </SvgIcon>
);

// Links for component
const socialLinks = [
  {
    name: 'Twitter',
    href: 'https://twitter.com/',
    icon: <TwitterIcon />,
    target: '_blank',
    rel: 'noopenner'
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/',
    icon: <FacebookIcon fontSize="large" titleAccess="Facebook logo" />,
    target: '_blank',
    rel: 'noopenner'
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/',
    icon: <InstagramIcon fontSize="large" titleAccess="Instagram logo" />,
    target: '_blank',
    rel: 'noopenner'
  }
];

/**
 * The RenderCompanyInfoSection component renders information about policy,
 * terms and conditions, and the site to Code for PDX
 *
 * @param {object} Props - The props for footer sub-component
 * @param {boolean} Props.isReallySmallScreen - Boolean for if screen is below theme
 * breakdown of 'sm' for MUI
 * @returns {React.JSX.Element} The RenderCompanyInfoSection component
 */
const RenderCompanyInfoSection = ({ isReallySmallScreen }) => (
  <Stack width={isReallySmallScreen ? 1 : 1 / 5} justifyContent="space-between" alignItems="center">
    <Box>
      <Typography color="tertiary.main" variant="h5" component="h2" mb={1}>
        Follow Us
      </Typography>
      <Stack direction="row" spacing={isReallySmallScreen ? 3 : 2} alignItems="center">
        {socialLinks.map(({ href, icon, name }) => (
          <Link
            key={href}
            href={href}
            target="_blank"
            rel="noopener"
            color="#fff"
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
