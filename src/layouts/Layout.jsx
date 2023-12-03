// React Imports
import React from 'react';
// Inrupt Library Imports
import { useSession, useNotification } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/system';
// Component Imports
import { NavBar, NavBarSkipLink } from '../components/NavBar';
import { InactivityMessage, NotificationContainer } from '../components/Notification';
import Footer from '../components/Footer/Footer';
import Breadcrumbs from './Breadcrumbs';

const Layout = ({ ariaLabel, children }) => {
  const { session } = useSession();
  const { state } = useNotification();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const isLoggedInSmallScreen = () =>
    session.info.isLoggedIn ? '64px 64px 1fr 560px' : '64px 1fr 560px';

  const isLoggedInDesktop = () =>
    session.info.isLoggedIn ? '64px 64px 1fr 280px' : '64px 1fr 280px';

  return (
    <Box
      aria-label={ariaLabel}
      sx={{
        display: 'grid',
        gridTemplateRows: isSmallScreen ? isLoggedInSmallScreen() : isLoggedInDesktop(),
        minHeight: '100vh'
      }}
    >
      <NavBarSkipLink />
      <NavBar />
      {session.info.isLoggedIn && <Breadcrumbs />}
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      {session.info.isLoggedIn && <InactivityMessage />}
      <Footer />
      <NotificationContainer notifications={state.notifications} />
    </Box>
  );
};

export default Layout;
