import React from 'react';
import { LogoutButton, useSession } from '@inrupt/solid-ui-react';

/**
 * Logout Component - Component that generates Logout section for users to a
 * Solid Pod via Solid Session
 *
 * @memberof Login
 * @name Logout
 */

const Logout = () => {
  const { session } = useSession();

  // Event handler for logging out of PASS and removing items from localStorage
  const handleLogout = () => {
    localStorage.removeItem('redirectUrl');
    localStorage.removeItem('issuerConfig:https://opencommons.net');
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
