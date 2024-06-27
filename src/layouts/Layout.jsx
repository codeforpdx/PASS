// React Imports
import React from 'react';
// Inrupt Library Imports
import { useSession, useNotification } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
// Component Imports
import { NavBar, NavBarSkipLink } from '@components/NavBar';
import { InactivityMessage, NotificationContainer } from '@components/Notification';
import Footer from '@components/Footer';
import Breadcrumbs from './Breadcrumbs';
import Main from './Main';

const Layout = ({ ariaLabel, children }) => {
  const { session } = useSession();
  const { state } = useNotification();

  return (
    <Box
      aria-label={ariaLabel}
      sx={{
        minHeight: '100vh'
      }}
    >
      <NavBarSkipLink />
      <NavBar />
      {session.info.isLoggedIn && <Breadcrumbs />}
      <Main>{children}</Main>
      {session.info.isLoggedIn && <InactivityMessage />}
      <Footer />
      <NotificationContainer notifications={state.notifications} />
    </Box>
  );
};

export default Layout;
