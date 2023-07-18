// React Imports
import React, { useState, useEffect, useRef } from 'react';
// Inrupt Library Imports
import { LogoutButton } from '@inrupt/solid-ui-react';
// Material UI Imports
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CheckIcon from '@mui/icons-material/Check';
import LogoutIcon from '@mui/icons-material/Logout';

/**
 * Inactivity Notification Component - Component that displays a popup modal
 * after 30 minutes of inactivity, prompting the user to either logout or
 * continue their session.
 *
 * @memberof Notification
 * @name InactivityMessage
 */

const InactivityMessage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [activeUser, setActiveUser] = useState(false);
  const [secondsToLogout, setSecondsToLogout] = useState(300);
  const logoutTimer = useRef();
  const timeToForcedLogout = useRef();

  // Event handler for logout and removing items from localStorage
  // Returns user to home page upon successful logout
  const handleLogout = () => {
    localStorage.clear();
  };

  // Checks for active user by looking for a loggedIn key in local storage
  useEffect(() => {
    const activeCheck = localStorage.getItem('loggedIn');
    setActiveUser(activeCheck === 'true');
  }, []);

  // Toggles the popup after thirty minutes of inactivity
  useEffect(() => {
    let timer = null;

    const resetTimeout = () => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        setShowPopup(true);
      }, 1800000);
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

  // Starts a five minute timer when the inactivity window pops up.
  useEffect(() => {
    if (showPopup) {
      logoutTimer.current = setInterval(() => {
          setSecondsToLogout((prev) => prev - 1);
      }, 1000)
    }
    return () => clearInterval(logoutTimer.current);
  }, [showPopup, seconds, minutes])

  // Event handler for logout and removing items from localStorage
  // Returns user to home page upon successful logout
  // TODO: In future PR, add countdown timer to automatically log user out if they do not select continue
  // (e.g. "You will be automatically logged out in 5:00 minutes")
  const handleLogout = () => {
    localStorage.clear();
  };

  // Event handler for popup's continue button
  // Closes the window, and resets the timer
  const handleClosePopup = () => {
    setShowPopup(false);
    setSeconds(0);
    setMinutes(5);
  }

  return (
    showPopup &&
    activeUser && (
      <Dialog
        open={showPopup}
        onClose={() => setShowPopup(false)}
        aria-labelledby="inactivity-message-title"
        aria-describedby="inactivity-message-description"
      >
        <DialogTitle id="inactivity-message-title">Continue session?</DialogTitle>
        <DialogContent id="inactivity-message-description">
          <DialogContentText>
            You have been inactive for a while now. Would you like to continue using PASS?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <LogoutButton>
            <Button
              variant="outlined"
              color="error"
              endIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </LogoutButton>
          <Button
            variant="contained"
            color="primary"
            endIcon={<CheckIcon />}
            sx={{ marginLeft: '1rem' }}
            onClick={() => setShowPopup(false)}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    )
  );
};

export default InactivityMessage;
