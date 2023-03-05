import { useSession, LoginButton, LogoutButton } from '@inrupt/solid-ui-react';
import React, { useState, useEffect } from 'react';
import { SOLID_IDENTITY_PROVIDER } from '../../utils';

/**
 * Login Component - Component that generates Login section to Solid Pod via Solid Session
 * @memberof Forms
 * @component
 * @name Login
 * @returns {void}
 */

const Login = () => {
  const { session } = useSession();
  const [currentUrl, setCurrentUrl] = useState('http://localhost:3000');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, [setCurrentUrl]);

  return (
    <section id="login" className="panel">
      <div className="row">
        <label id="labelLogin" htmlFor="btnLogin">
          Click the following login button to log into your pod at [
          <a href={SOLID_IDENTITY_PROVIDER} target="_blank" rel="noreferrer">
            {SOLID_IDENTITY_PROVIDER}
          </a>
          ]:{' '}
        </label>
        {!session.info.isLoggedIn ? (
          <>
            <LoginButton
              oidcIssuer={SOLID_IDENTITY_PROVIDER}
              redirectUrl={currentUrl}
              onError={console.error}
            >
              <button type="submit">Login</button>
            </LoginButton>
            <p>Not logged in</p>
          </>
        ) : (
          <>
            <LogoutButton>
              <button type="submit">Logout</button>
            </LogoutButton>
            <p className="labelStatus" role="alert">
              Your session is logged in with the WebID [
              <a href={session.info.webId} target="_blank" rel="noreferrer">
                {session.info.webId}
              </a>
              ].
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default Login;
