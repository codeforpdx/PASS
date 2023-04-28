import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from '@mui/base';

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
    if (activeCheck) setActiveUser(activeCheck);
  }, []);

  // Toggles the popup after three minutes of inactivity
  useEffect(() => {
    let timer = null;

    const resetTimeout = () => {
      if (timer) clearTimeout(timer);
  
      timer = setTimeout(() => {
        setShowPopup(true);
      }, 180000)
    }
  
    const handleUserActivity = () => {
      resetTimeout();
    };
  
    resetTimeout();
  
    window.addEventListener('mousedown', handleUserActivity);
    window.addEventListener('mousemove', handleUserActivity);    

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousedown', handleUserActivity);
      window.removeEventListener('mousemove', handleUserActivity);
    }    
  }, [])

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
    <Modal open={showPopup && activeUser} 
      style={{ display: 'flex', backgroundColor: 'white', 
               alignItems: 'center', borderRadius: '10px', position: 'fixed',
               top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 99 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px', border: '2px solid black', borderRadius: '10px' }}>
        <p>You've been inactive for a few minutes now. Would you like to log out?</p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Button onClick={() => setShowPopup(false)} style={{ width: '100px', backgroundColor: 'white', borderColor: 'black', borderRadius: '5px', cursor: 'pointer' }}>
            Continue Session
          </Button>
          <Button onClick={() => handleLogout()} variant='contained' style={{ width: '100px', backgroundColor: '#4287f5', color: 'white', borderColor: 'black', borderRadius: '5px', cursor: 'pointer' }}>
            Log Out
          </Button>
        </div>
      </div>
    </Modal>
    )
}


export default InactivityMessage;