// React Imports
import React from 'react';
// Inrupt Library Imports
import { useSession } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
// Component Imports
import { NavBar } from '../components/NavBar';
import { InactivityMessage } from '../components/Notification';
import Footer from '../components/Footer/Footer';
import NotificationContainer from '../components/Notification/NotificationContainer';
import useNotification from '../hooks/useNotification';

const Layout = ({ ariaLabel, children }) => {
  const { session } = useSession();
  const { state } = useNotification();

  return (
    <Box
      aria-label={ariaLabel}
      sx={{
        display: 'grid',
        gridTemplateRows: { xs: 'none', sm: '64px 1fr 280px' },
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
