// React Imports
import React, { useState, useEffect, useRef } from 'react';
// Inrupt Library Imports
import { LogoutButton } from '@inrupt/solid-ui-react';
// Styling Imports
import styled from 'styled-components';
// Material UI Base imports; TODO: Update imports to @mui/material when re-styling
import Button from '@mui/base/Button';

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
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const logoutTimer = useRef();

  // Checks for active user by looking for a loggedIn key in local storage
  useEffect(() => {
    const activeCheck = localStorage.getItem('loggedIn');
    setActiveUser(activeCheck === 'true');
  }, []);

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

  /* Starts a five minute timer when the inactivity window pops up. 
     Logs the user out and refreshes the page if time elapses. */
  useEffect(() => {
    if (showPopup) {
      logoutTimer.current = setInterval(() => {
        if (seconds === 0 && minutes === 0) {
          handleLogout();
          window.location.reload(false);
        } else if (seconds === 0) {
          setSeconds(59);
          setMinutes((minutes) => minutes - 1);
        } 
          else if (seconds > 0) {
          setSeconds((seconds) => seconds - 1);
        }
      }, 1000)
    }
    return () => clearInterval(logoutTimer.current);
  }, [showPopup, seconds, minutes])

  // Event handler for logout and removing items from localStorage
  // Returns user to home page upon successful logout
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
      <StyledOverlay>
        <StyledModal>
          <StyledContainer>
            <p>You have been inactive for a while now. Would you like to log out?</p>
            <ButtonsContainer>
              <StyledButton onClick={handleClosePopup}>Continue Session</StyledButton>
              <LogoutButton>
                <StyledLogoutButton onClick={handleLogout}>Log Out</StyledLogoutButton>
              </LogoutButton>
            </ButtonsContainer>
            <p>You will automatically be logged out in {minutes}:{seconds.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}</p>
          </StyledContainer>
        </StyledModal>
      </StyledOverlay>
    )
  );
};

const StyledOverlay = styled('div')({
  height: '100vh',
  width: '100vw',
  backgroundColor: 'rgb(128, 128, 128, .7)',
  backdropFilter: 'blur(2px)',
  zIndex: 99,
  top: '0%',
  left: '0%',
  position: 'fixed'
});

const StyledButton = styled(Button)({
  width: '100px',
  backgroundColor: 'white',
  borderColor: 'black',
  borderRadius: '5px',
  cursor: 'pointer',
  '&:hover': {
    filter: 'brightness(0.9)'
  }
});

const StyledLogoutButton = styled(StyledButton)({
  backgroundColor: '#017969',
  height: '100%',
  color: '#fff'
});

const StyledModal = styled('div')({
  display: 'flex',
  backgroundColor: 'white',
  alignItems: 'center',
  borderRadius: '10px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 99
});

const StyledContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '50px',
  border: '2px solid black',
  borderRadius: '10px'
});

const ButtonsContainer = styled('div')({
  display: 'flex',
  gap: '20px'
});

export default InactivityMessage;
