// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Component Imports
import RenderCallToActionSection from './RenderCallToActionSection';
import RenderCompanyInfoSection from './RenderCompanyInfoSection';
import RenderCopyrightAndLinksSection from './RenderCopyrightAndLinksSection';

/**
 * Footer Component - Generates the responsive footer used in PASS
 *
 * @memberof Footer
 * @name Footer
 * @returns {React.JSX.Element} The Footer component
 */
const Footer = () => {
  const theme = useTheme();
  const isReallySmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component="footer"
      py={5}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'sticky',
        top: '100%',
        textAlign: 'center',
        bgcolor: 'primary.main'
      }}
    >
      <Stack
        alignItems="center"
        direction={isReallySmallScreen ? 'column' : 'row'}
        spacing={isReallySmallScreen ? 1 : 4}
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
    </Box>
  );
};

export default Footer;
