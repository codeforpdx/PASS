// React Imports
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Material UI Imports
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Component Imports
import { SignInModal } from '@components/Modals';
import OidcLoginComponent from './OidcLoginComponent';

/**
 * NavbarLoggedOut Component - Component that generates Navbar section for PASS
 * when a user is logged out
 *
 * @memberof NavBar
 * @name NavbarLoggedOut
 * @returns {React.JSX.Element} - The NavbarLoggedOut Component
 */
const NavbarLoggedOut = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [showSignInModal, setShowSignInModal] = useState(false);

  const handleSignIn = () => {
    setShowSignInModal(!showSignInModal);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ minHeight: '64px', justifyContent: 'space-between' }}>
          <Link to="/" aria-label="Home">
            <img src="/pass-logo.png" alt="PASS logo" style={{ marginRight: '2rem' }} />
          </Link>
          {isSmallScreen ? (
            <>
              <Button variant="contained" color="secondary" size="large" onClick={handleSignIn}>
                Sign In
              </Button>
              <SignInModal
                showSignInModal={showSignInModal}
                setShowSignInModal={setShowSignInModal}
              />
            </>
          ) : (
            <OidcLoginComponent />
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavbarLoggedOut;
