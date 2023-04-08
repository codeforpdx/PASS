import React, { useContext } from 'react';
import { LogoutButton, useSession } from '@inrupt/solid-ui-react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Card from '@mui/material/Card';
// import Container from '@mui/material/Container';
// import CssBaseline from '@mui/material/CssBaseline';
import { RouterContext } from '../../contexts';

/**
 * Logout Component - Component that generates Logout section for users to a
 * Solid Pod via Solid Session
 *
 * @memberof Login
 * @name Logout
 */

const Logout = () => {
  const { session } = useSession();
  const { currentUrl } = useContext(RouterContext);

  const handleLogout = () => {
    window.location.href = `${currentUrl.split('PASS')[0]}PASS/`;
  };

  return (
    <section id="logout" className="panel">
      <div className="row">
        <label id="labelLogout" htmlFor="btnLogout">
          Click the following logout button to log out of your pod:{' '}
        </label>
        <LogoutButton onLogout={handleLogout} />
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
