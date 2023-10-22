// React Imports
import React from 'react';
import { Link } from 'react-router-dom';
// Material UI Imports
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
// Component Imports
import OidcLoginComponent from './OidcLoginComponent';

/**
 * NavbarLoggedOut Component - Component that generates Navbar section for PASS
 * when a user is logged out
 *
 * @memberof NavBar
 * @name NavbarLoggedOut
 * @returns {React.JSX.Element} - The NavbarLoggedOut Component
 */
const NavbarLoggedOut = () => (
  <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static" color="primary">
      <Toolbar sx={{ minHeight: '64px' }}>
        <Link to="/" aria-label="Home">
          <img src="/pass-logo.png" alt="PASS logo" style={{ marginRight: '2rem' }} />
        </Link>
        <OidcLoginComponent />
      </Toolbar>
    </AppBar>
  </Box>
);

export default NavbarLoggedOut;
