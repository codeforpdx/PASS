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
 * after 25 minutes of inactivity, prompting the user to either logout or
 * continue their session. If the user does not act within five minutes of
 * the popup appearing, they are forcibly logged out.
 *
 * @memberof Notification
 * @name InactivityMessage
 */

const InactivityMessage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [activeUser, setActiveUser] = useState(false);
  const [secondsToLogout, setSecondsToLogout] = useState(15);
  const logoutTimer = useRef();

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

  // Toggles the popup after twenty-five minutes of inactivity.
  useEffect(() => {
    let timer = null;

    const resetTimeout = () => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        setShowPopup(true);
      }, 1500);
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
  // If secondsToLogout reaches 0, forcibly logs the user out.
  useEffect(() => {
    if (showPopup) {
      logoutTimer.current = setInterval(() => {
          if ( secondsToLogout > 0 ) {
            setSecondsToLogout((prev) => prev - 1);
          } else if ( secondsToLogout == 0 ) {
            handleLogout();
            window.location.reload();
          }
      }, 1000)
    }
    return () => {
      clearInterval(logoutTimer.current);
      if (showPopup == false) setSecondsToLogout(15);
    }
  }, [showPopup, secondsToLogout])

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
            You will automatically be logged out in {Math.floor(secondsToLogout/60)}:
                                                    {(secondsToLogout % 60).toLocaleString('en-US', {
                                                      minimumIntegerDigits: 2,
                                                      useGrouping: false
                                                    })}
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