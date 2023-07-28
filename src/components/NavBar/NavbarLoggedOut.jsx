// React Imports
import React from 'react';
// Material UI Imports
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// Component Imports
import OidcLoginComponent from './OidcLoginComponent';

/**
 * NavbarLoggedOut Component - Component that generates Navbar section for PASS
 * when a user is logged out
 *
 * @memberof GlobalComponents
 * @name NavbarLoggedOut
 */

const NavbarLoggedOut = () => (
  <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static" color="primary">
      <Toolbar sx={{ minHeight: '64px' }}>
      <img src='src\assets\pass-logo.png' alt='logo' className='navbar-logo'/>
        <OidcLoginComponent />
      </Toolbar>
    </AppBar>
  </Box>
);

export default NavbarLoggedOut;
