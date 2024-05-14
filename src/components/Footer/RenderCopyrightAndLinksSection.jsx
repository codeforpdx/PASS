// React Imports
import React from 'react';
// Other Library Imports
import dayjs from 'dayjs';
// Material UI Imports
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// Links for component
const legalLinks = [
  {
    href: 'https://www.codepdx.org/',
    title: 'Privacy Policy'
  },
  {
    href: 'https://www.codepdx.org/',
    title: 'Terms and Conditions'
  },
  {
    href: 'https://www.codepdx.org/',
    title: 'CODE PDX',
    ml: 0.5,
    text: `©${dayjs().year()}`
  }
];

/**
 * The RenderCopyrightAndLinksSection component renders information about policy,
 * terms and conditions, and the site to Code for PDX
 *
 * @param {object} Props - The props for footer sub-component
 * @param {boolean} Props.isReallySmallScreen - Boolean for if screen is below theme
 * breakdown of 'sm' for MUI
 * @returns {React.JSX.Element} The RenderCopyrightAndLinksSection component
 */
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
          target="_blank"
          rel="noopenner"
          ml={link.ml ?? null}
        >
          {link.title}
        </Link>
      </Typography>
    ))}
  </Stack>
);

export default RenderCopyrightAndLinksSection;
