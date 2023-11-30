// React Imports
import React from 'react';
// Material UI Imports
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/**
 * The RenderCallToActionSection component renders information about policy,
 * terms and conditions, and the site to Code for PDX
 *
 * @param {object} Props - The props for footer sub-component
 * @param {boolean} Props.isReallySmallScreen - Boolean for if screen is below theme
 * breakdown of 'sm' for MUI
 * @returns {React.JSX.Element} The RenderCallToActionSection component
 */
const RenderCallToActionSection = ({ isReallySmallScreen }) => (
  <Stack width={isReallySmallScreen ? 1 : 3 / 5} alignItems="center" justifyContent="center">
    <Typography variant="h5" component="h2" color="tertiary.main">
      Want to partner with PASS?
    </Typography>
    <Typography variant="body1" color="#fff" sx={{ width: 3 / 4 }}>
      If your organization is interested in partnering with PASS and would like to discuss further,
      contact us below.
    </Typography>
    <Button
      variant="contained"
      color="secondary"
      href="mailto:hugh@codeforpdx.org"
      target="_blank"
      rel="noopener"
      sx={{ my: '1rem', width: 1 / 2 }}
    >
      Make a Proposal
    </Button>
  </Stack>
);

export default RenderCallToActionSection;
