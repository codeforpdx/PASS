import React from 'react';
import { useSession, LogoutButton } from '@inrupt/solid-ui-react';

/**
 * Logout Component - Component that generates Logout section for users to a
 * Solid Pod via Solid Session
 * @memberof Login
 * @component
 * @name Logout
 */

const Logout = () => {
  const { session } = useSession();

  return (
    <section id="logout" className="panel">
      <div className="col s12">
        <div className="card horizontal">
          <div className="card-stacked">
            <div className="card-content">
              <div className="section no-pad-bot row center">
                <label id="labelLogout" htmlFor="btnLogout">
                  Click the following logout button to log out of your pod:{' '}
                </label>
                <LogoutButton>
                  <button type="submit" className="waves-effect waves-light btn">
                    Logout
                  </button>
                </LogoutButton>
                <p className="labelStatus" role="alert">
                  Your session is now logged in with the WebID [
                  <a href={session.info.webId} target="_blank" rel="noreferrer">
                    {session.info.webId}
                  </a>
                  ].
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Logout;
