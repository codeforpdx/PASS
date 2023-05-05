/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useSession, LogoutButton } from '@inrupt/solid-ui-react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
// import { RouterContext } from '../../contexts';

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
    <>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Paper elevation={2} sx={{ display: 'inline-block', mx: '2px', padding: '20px' }}>
            <section id="logout" className="panel">
              <div className="row">
                <label id="labelLogout" htmlFor="btnLogout">
                  Click the following logout button to log out of your pod:{' '}
                </label>
                <Button
                  variant="contained"
                  aria-label="outlined primary button group"
                  color="secondary"
                  onClick={() => setShowConfirmation(true)}
                >
                  Log Out
                </Button>
                <dialog open={showConfirmation}>
                  <p>Do you want to log out now?</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <LogoutButton onLogout={handleLogout} />
                    <button type="button" onClick={() => setShowConfirmation(false)}>
                      <Button>Cancel</Button>
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
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Logout;
