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

// Linkedin Icon
const LinkedInIcon = () => (
  <SvgIcon
    viewBox="0 0 200 200"
    sx={{ width: '1.25em', height: '1.25em' }}
    titleAccess="LinkedIn logo"
  >
    <path
      d="M156,0h-120c-19.875,0 -36,16.125 -36,36v120c0,19.875 16.125,36 36,36h120c19.875,0 36,-16.125 36,-36v-120c0,-19.875 -16.125,-36 -36,-36zM59.36539,162.98077h-29.82693l-0.17307,-89.30769h29.82692zM43.70192,61.99038h-0.17308c-9.75,0 -16.03846,-6.72115 -16.03846,-15.08653c0,-8.56731 6.49039,-15.0577 16.41347,-15.0577c9.92308,0 16.00961,6.49038 16.21153,15.0577c0,8.36538 -6.31731,15.08653 -16.41346,15.08653zM162.77885,162.98077h-30.08654v-48.51923c0,-11.74039 -3.11538,-19.73077 -13.61538,-19.73077c-8.01923,0 -12.34615,5.39423 -14.42308,10.61538c-0.77885,1.875 -0.98077,4.44231 -0.98077,7.06731v50.56731h-30.23077l-0.17308,-89.30769h30.23077l0.17308,12.60577c3.86538,-5.97116 10.29808,-14.42308 25.70192,-14.42308c19.09616,0 33.37501,12.46154 33.37501,39.25961v51.86539z"
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
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/code-pdx/',
    // icon: <FaceIcon fontSize="large" titleAccess="Instagram logo" />,
    icon: <LinkedInIcon />,
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
        Connect
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
