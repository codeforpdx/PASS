// React Imports
import React from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
// Component Imports
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
