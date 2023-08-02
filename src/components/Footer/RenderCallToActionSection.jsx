// React Imports
import React from 'react';
// Material UI Imports
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/**
 * @typedef {import("../../typedefs.js").footerProps} footerProps
 */

/**
 * The RenderCallToActionSection component renders information about policy,
 * terms and conditions, and the site to Code for PDX
 *
 * @param {footerProps} isReallySmallScreen - The props for footer sub-component
 * @returns {React.JSX.Element} The RenderCallToActionSection component
 */
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

export default RenderCallToActionSection;
