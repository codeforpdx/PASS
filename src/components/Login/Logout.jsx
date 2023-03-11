import React from 'react';
import { useSession, LogoutButton } from '@inrupt/solid-ui-react';

/**
 * Logout Component - Component that generates Logout section for users to a Solid Pod via Solid Session
 * @memberof Login
 * @component
 * @name Logout
 */

const Logout = () => {
  const { session } = useSession();

  return (
    <section id="login" className="panel">
      <div className="row">
        <label id="labelLogout" htmlFor="btnLogout">
          Click the following logout button to log out of your pod:{' '}
        </label>
        <LogoutButton>
          <button type="submit">Logout</button>
        </LogoutButton>
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
