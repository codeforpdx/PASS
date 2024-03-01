import React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import RenderCallToActionSection from './RenderCallToActionSection';
import RenderCompanyInfoSection from './RenderCompanyInfoSection';
import RenderCopyrightAndLinksSection from './RenderCopyrightAndLinksSection';

const Footer = () => {
  const theme = useTheme();
  const isReallySmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'sticky',
        top: '100%',
        textAlign: 'center',
        bgcolor: 'primary.main',
        height: 'auto',
        padding: '5px'
      }}
    >
      <Stack
        alignItems="center"
        direction={isReallySmallScreen ? 'column' : 'row'}
        spacing={isReallySmallScreen ? 1 : 2}
        divider={<Divider orientation={isReallySmallScreen ? 'horizontal' : 'vertical'} flexItem />}
      >
        <RenderCallToActionSection isReallySmallScreen={isReallySmallScreen} />
        <RenderCompanyInfoSection isReallySmallScreen={isReallySmallScreen} />
        <RenderCopyrightAndLinksSection isReallySmallScreen={isReallySmallScreen} />
      </Stack>
    </Box>
  );
};

export default Footer;
