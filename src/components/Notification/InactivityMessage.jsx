import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Modal, Button } from '@mui/base';
import { LogoutButton } from '@inrupt/solid-ui-react';

/**
 * Inactivity Notification Component - Component that displays a popup modal
 * after 3 minutes of inactivity, prompting the user to either logout or
 * continue their session.
 *
 * @memberof Notification
 * @name InactivityMessage
 */

const InactivityMessage = () => {
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [activeUser, setActiveUser] = useState(false);

  // Checks for active user by looking for a loggedIn key in local storage
  useEffect(() => {
    const activeCheck = localStorage.getItem('loggedIn');
    if (activeCheck) setActiveUser(true);
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

    window.addEventListener('mousedown', handleUserActivity);
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousedown', handleUserActivity);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
    };
  }, []);

  // Event handler for logging out of PASS and removing items from localStorageimport { LogoutButton } from '@inrupt/solid-ui-react';
  // Returns user to home page upon successful logout
  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('redirectUrl');
    localStorage.removeItem('restorePath');
    localStorage.removeItem('issuerConfig:https://opencommons.net');
    navigate('/');
  };

  return (
    <StyledModal open={showPopup && activeUser}>
      <StyledContainer>
        <p>You've been inactive for a few minutes now. Would you like to log out?</p>
        <ButtonsContainer>
          <StyledButton onClick={() => setShowPopup(false)}>Continue Session</StyledButton>
          <LogoutButton onLogout={handleLogout}>
            <StyledLogoutButton>Log Out</StyledLogoutButton>
          </LogoutButton>
        </ButtonsContainer>
      </StyledContainer>
    </StyledModal>
  );
};

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
  backgroundColor: '#4287f5',
  height: '100%',
  color: '#fff'
});

const StyledModal = styled(Modal)({
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
