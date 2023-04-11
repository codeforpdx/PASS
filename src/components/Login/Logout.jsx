import React, { useContext } from 'react';
import { LogoutButton, useSession } from '@inrupt/solid-ui-react';
import RouterContext from '../../contexts/routerContext';

/**
 * Logout Component - Component that generates Logout section for users to a
 * Solid Pod via Solid Session
 *
 * @memberof Login
 * @name Logout
 */

const Logout = () => {
  const { session } = useSession();
  const { redirectUrl } = useContext(RouterContext);

  const handleLogout = () => {
    window.location.href = `${redirectUrl.split('PASS')[0]}PASS/`;
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
