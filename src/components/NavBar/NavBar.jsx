// React Imports
import React, { useState } from 'react';
// Custom Hook Imports
import { useNotification, useSession } from '@hooks';
// Material UI Imports
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Component Import
import { ConfirmationModal, LogoutModal } from '../Modals';
import NavbarDesktop from './NavbarDesktop';
import NavbarLoggedOut from './NavbarLoggedOut';
import NavbarMobile from './NavbarMobile';

/**
 * NavBar Component - Component that generates proper NavBar section for PASS
 *
 * @memberof GlobalComponents
 * @name NavBar
 */

const NavBar = () => {
  const { session } = useSession();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const { addNotification } = useNotification();

  // state for LogoutModal component
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Event handler for logging out of SOLID POD and removing items from localStorage
  const handleLogout = () => {
    localStorage.clear();
    setShowConfirmation(false);
  };

  // states for ConfirmationModal
  const [processing, setProcessing] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleLogout2 = async () => {
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
      {isSmallScreen && <NavbarMobile setShowConfirmation={setShowConfirmation} />}
      {isLargeScreen && <NavbarDesktop setShowConfirmation={setShowConfirmation} />}
      <ConfirmationModal
        showConfirmationModal={showConfirmationModal}
        setShowConfirmationModal={setShowConfirmationModal}
        title="Log out?"
        text="This will log you out of your pod. Are you sure?"
        confirmButtonFunction={handleLogout2}
        confirmButtonText="YES"
        processing={processing}
      />
      {/* <LogoutModal
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        handleLogout={handleLogout}
      /> */}
    </>
  ) : (
    <NavbarLoggedOut />
  );
};

export default NavBar;
