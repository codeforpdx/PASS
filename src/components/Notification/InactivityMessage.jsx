// React Imports
import React, { useState, useEffect } from 'react';
// Inrupt Library Imports
import { LogoutButton } from '@inrupt/solid-ui-react';
// Material UI Imports
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';

/**
 * Inactivity Notification Component - Component that displays a popup modal
 * after 3 minutes of inactivity, prompting the user to either logout or
 * continue their session.
 *
 * @memberof Notification
 * @name InactivityMessage
 */

const InactivityMessage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [activeUser, setActiveUser] = useState(false);

  // Checks for active user by looking for a loggedIn key in local storage
  useEffect(() => {
    const activeCheck = localStorage.getItem('loggedIn');
    setActiveUser(activeCheck === 'true');
  }, []);

  // Toggles the popup after three minutes of inactivity
  useEffect(() => {
    let timer = null;

    const resetTimeout = () => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        setShowPopup(true);
      }, 180000);
    };

    const handleUserActivity = () => {
      resetTimeout();
    };

    resetTimeout();

    const eventTypes = ['mousedown', 'mousemove', 'touchstart'];

    eventTypes.forEach((eventType) => {
      window.addEventListener(eventType, handleUserActivity);
    });

    return () => {
      clearTimeout(timer);
      eventTypes.forEach((eventType) => {
        window.removeEventListener(eventType, handleUserActivity);
      });
    };
  }, []);

  // Event handler for logout and removing items from localStorage
  // Returns user to home page upon successful logout
  const handleLogout = () => {
    localStorage.clear();
  };

  return (
    showPopup &&
    activeUser && (
      <Dialog
        open={showPopup}
        onClose={() => setShowPopup(false)}
        aria-labelledby="inactivity-message-title"
        aria-describedby="inactivity-message-description"
      >
        <DialogTitle>Confirm Log Out</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have been inactive for a few minutes now. Would you like to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            endIcon={<CheckIcon />}
            onClick={() => setShowPopup(false)}
            autoFocus
          >
            Continue Session
          </Button>
          <LogoutButton>
            <Button
              variant="contained"
              color="error"
              endIcon={<ClearIcon />}
              sx={{ marginLeft: '1rem' }}
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </LogoutButton>
        </DialogActions>
      </Dialog>
    )
  );
};

export default InactivityMessage;
