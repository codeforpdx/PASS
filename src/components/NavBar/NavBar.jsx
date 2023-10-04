// React Imports
import React, { useState } from 'react';
// Custom Hook Imports
import { useNotification, useSession } from '@hooks';
// Material UI Imports
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Component Import
import { ConfirmationModal } from '../Modals';
import NavbarDesktop from './NavbarDesktop';
import NavbarLoggedOut from './NavbarLoggedOut';
import NavbarMobile from './NavbarMobile';

/**
 * NavBar Component - Component that generates proper NavBar section for PASS
 *
 * @memberof GlobalComponents
 * @name NavBar
 * @returns {React.JSX.Element} - The Navbar component
 */
const NavBar = () => {
  const { session } = useSession();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const { addNotification } = useNotification();

  // states for ConfirmationModal
  const [processing, setProcessing] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // function for ConfirmationModal
  const handleLogout = async () => {
    setProcessing(true);
    try {
      localStorage.clear();
      addNotification('success', 'You have been logged out');
    } catch (e) {
      addNotification('error', `Log out failed. Reason: ${e.message}`);
    } finally {
      setShowConfirmationModal(false);
      setProcessing(false);
    }
  };

  return session.info.isLoggedIn ? (
    <>
      {isSmallScreen && <NavbarMobile setShowConfirmation={setShowConfirmationModal} />}
      {isLargeScreen && <NavbarDesktop setShowConfirmation={setShowConfirmationModal} />}
      <ConfirmationModal
        showConfirmationModal={showConfirmationModal}
        setShowConfirmationModal={setShowConfirmationModal}
        title="Log Out"
        text="This will log you out of your pod. Are you sure?"
        confirmFunction={handleLogout}
        processing={processing}
        isLogout
      />
    </>
  ) : (
    <NavbarLoggedOut />
  );
};

export default NavBar;
