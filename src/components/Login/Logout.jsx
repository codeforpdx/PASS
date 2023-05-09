// React Imports
import React, { useState } from 'react';
// Solid Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
// Custom Component Imports
import LogoutModal from './LogoutModal';

/**
 * Logout Component - Component that generates Logout section for users to a
 * Solid Pod via Solid Session
 *
 * @memberof Login
 * @name Logout
 */

const Logout = () => {
  const { session } = useSession();
  localStorage.setItem('loggedIn', true);
  // state for LogoutModal popup
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Event handler for logging out of SOLID POD and removing items from localStorage
  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('redirectUrl');
    localStorage.removeItem('restorePath');
    localStorage.removeItem('issuerConfig:https://opencommons.net');
    setShowConfirmation(false);
  };

  return (
    <section id="logout" className="panel">
      <Box className="row">
        <label id="labelLogout" htmlFor="btnLogout">
          Click the following logout button to log out of your pod:{' '}
        </label>
        <Button
          id="btnLogout"
          variant="outlined"
          size="small"
          type="button"
          color="error"
          endIcon={<LogoutIcon />}
          onClick={() => setShowConfirmation(true)}
        >
          Log Out
        </Button>

        <Typography variant="body1" className="labelStatus" role="alert">
          Your session is now logged in with the WebID [
          <Link href={session.info.webId} target="_blank" rel="noreferrer">
            {session.info.webId}
          </Link>
          ].
        </Typography>

        {/* modal/popup renders when showConfirmation state is true */}
        <LogoutModal
          showConfirmation={showConfirmation}
          setShowConfirmation={setShowConfirmation}
          handleLogout={handleLogout}
        />
      </Box>
    </section>
  );
};

export default Logout;
