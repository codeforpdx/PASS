/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useSession, LogoutButton } from '@inrupt/solid-ui-react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Card from '@mui/material/Card';
// import Container from '@mui/material/Container';
// import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
// import { RouterContext } from '../../contexts';
import theme from '../../theme';

/**
 * Logout Component - Component that generates Logout section for users to a
 * Solid Pod via Solid Session
 *
 * @memberof Login
 * @name Logout
 */

const Logout = () => {
  const { session } = useSession();
  const [showConfirmation, setShowConfirmation] = useState(false);
  localStorage.setItem('loggedIn', true);

  // Event handler for logging out of PASS and removing items from localStorage
  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('redirectUrl');
    localStorage.removeItem('restorePath');
    localStorage.removeItem('issuerConfig:https://opencommons.net');
  };

  return (
    <section id="logout" className="panel">
      <div className="row">
        <label id="labelLogout" htmlFor="btnLogout">
          Click the following logout button to log out of your pod:{' '}
        </label>
        <button type="button" onClick={() => setShowConfirmation(true)}>
          Log Out
        </button>
        <dialog open={showConfirmation}>
          <p>Do you want to log out now?</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <LogoutButton onLogout={handleLogout} />
            <button type="button" onClick={() => setShowConfirmation(false)}>
              Cancel
            </button>
          </div>
        </dialog>
        <p className="labelStatus" role="alert">
          Your session is now logged in with the WebID [
          <a href={session.info.webId} target="_blank" rel="noreferrer">
            {session.info.webId}
          </a>
          ].
        </p>
      </div>
    </section>
  );
};

export default Logout;
