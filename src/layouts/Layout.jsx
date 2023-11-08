// React Imports
import React from 'react';
// Inrupt Library Imports
import { useSession, useNotification } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/system';
// Component Imports
import { NavBar } from '../components/NavBar';
import { InactivityMessage } from '../components/Notification';
import Footer from '../components/Footer/Footer';
import NotificationContainer from '../components/Notification/NotificationContainer';

const Layout = ({ ariaLabel, children }) => {
  const { session } = useSession();
  const { state } = useNotification();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      aria-label={ariaLabel}
      sx={{
        display: 'grid',
        gridTemplateRows: isSmallScreen ? '64px 1fr 1fr' : '64px 1fr 280px',
        minHeight: '100vh'
      }}
    >
      <NavBar />
      {children}
      {session.info.isLoggedIn && <InactivityMessage />}
      <Footer />
      <NotificationContainer notifications={state.notifications} />
    </Box>
  );
};

export default Layout;
