import { useSession, LogoutButton } from '@inrupt/solid-ui-react';
import React from 'react';
import { SOLID_IDENTITY_PROVIDER } from '../../utils';

/**
 * Logout Component - Component that generates Logout section to Solid Pod via Solid Session
 * @memberof Forms
 * @component
 * @name Logout
 * @returns {void}
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
