// React Imports
import React from 'react';
// Inrupt Library Imports
import { useSession, useNotification } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
// Component Imports
import { NavBar } from '../components/NavBar';
import { InactivityMessage, NotificationContainer } from '../components/Notification';
import Footer from '../components/Footer/Footer';
import Breadcrumbs from './Breadcrumbs';

const Layout = ({ ariaLabel, children }) => {
  const { session } = useSession();
  const { state } = useNotification();

  return (
    <Box
      aria-label={ariaLabel}
      sx={{
        display: 'grid',
        gridTemplateRows: {
          xs: 'none',
          sm: session.info.isLoggedIn ? '64px 64px 1fr 280px' : '64px 1fr 280px'
        },
        minHeight: '100vh'
      }}
    >
      <NavBar />
      {session.info.isLoggedIn && <Breadcrumbs />}
      {children}
      {session.info.isLoggedIn && <InactivityMessage />}
      <Footer />
      <NotificationContainer notifications={state.notifications} />
    </Box>
  );
};

export default Layout;
