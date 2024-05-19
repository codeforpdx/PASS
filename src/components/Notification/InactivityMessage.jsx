// React Imports
import React, { useEffect, useState, useRef } from 'react';
// Custom Hook Imports
import { useSession } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LogoutIcon from '@mui/icons-material/Logout';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Component Imports
import LogoutButton from '../Modals/LogoutButton';

/**
 * InactivityMessage - Component that displays a popup modal
 * after 25 minutes of inactivity, prompting the user to either logout or
 * continue their session.
 *
 * @memberof Notification
 * @name InactivityMessage
 * @returns {React.JSX.Element} The InactivityMessage Component
 */
const InactivityMessage = () => {
  const { session, logout } = useSession();
  const [showPopup, setShowPopup] = useState(false);
  const [secondsToLogout, setSecondsToLogout] = useState(300);
  const logoutTimer = useRef();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Toggles the popup after twenty-five minutes of inactivity
  useEffect(() => {
    let timer = null;

    const resetTimeout = () => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        setShowPopup(true);
      }, 1500000);
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

  /* Starts a five minute timer that is displayed to the user when the 
  inactivity window pops up. If said timer runs out, the user is 
  forcibly logged out. */
  useEffect(() => {
    if (showPopup) {
      logoutTimer.current = setInterval(() => {
        if (secondsToLogout > 0) {
          setSecondsToLogout((prev) => prev - 1);
        } else if (secondsToLogout === 0) {
          localStorage.clear();
          logout();
          setShowPopup(false);
        }
      }, 1000);
    }
    return () => {
      clearInterval(logoutTimer.current);
      if (showPopup === false) setSecondsToLogout(300);
    };
  }, [showPopup, secondsToLogout]);

  return (
    showPopup &&
    session.info.isLoggedIn && (
      <Dialog
        open={showPopup}
        aria-labelledby="inactivity-message-title"
        aria-describedby="inactivity-message-description"
        PaperProps={{
          sx: {
            borderRadius: '25px'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <DialogTitle id="inactivity-message-title" sx={{ fontWeight: 'bold' }}>
            CONTINUE SESSION?
          </DialogTitle>

          <DialogContent id="inactivity-message-description">
            <DialogContentText>
              You have been inactive for a while now. Would you like to continue using PASS? You
              will automatically be logged out in {Math.floor(secondsToLogout / 60)}:
              {(secondsToLogout % 60).toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
              })}
            </DialogContentText>
          </DialogContent>

          <DialogActions sx={{ width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: isSmallScreen ? 'column' : 'row',
                gap: isSmallScreen ? '10px' : '8px',
                width: '100%'
              }}
            >
              <LogoutButton onLogout={() => localStorage.clear()}>
                <Button variant="outlined" color="error" endIcon={<LogoutIcon />} fullWidth>
                  Log Out
                </Button>
              </LogoutButton>
              <Button
                variant="contained"
                color="primary"
                endIcon={<CheckIcon />}
                fullWidth
                onClick={() => setShowPopup(false)}
              >
                Continue
              </Button>
            </Box>
          </DialogActions>
        </Box>
      </Dialog>
    )
  );
};

export default InactivityMessage;
