import React from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import Box from '@mui/material/Box';
import { NavBar } from '../components/NavBar';
import { InactivityMessage } from '../components/Notification';
import Footer from '../components/Footer/Footer';

const Layout = ({ children }) => {
  const { session } = useSession();
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <NavBar />
      {children}
      {session.info.isLoggedIn && <InactivityMessage />}
      <Footer />
    </Box>
  );
};

export default Layout;
