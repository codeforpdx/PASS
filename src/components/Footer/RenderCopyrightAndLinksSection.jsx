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
    text: `©${dayjs().year()}`,
    title: 'Code for PDX'
  }
];

/**
 * @typedef {import("../../typedefs.js").footerProps} footerProps
 */

/**
 * The RenderCopyrightAndLinksSection component renders information about policy,
 * terms and conditions, and the site to Code for PDX
 *
 * @param {footerProps} Props - The props for footer sub-component
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

export default RenderCopyrightAndLinksSection;
