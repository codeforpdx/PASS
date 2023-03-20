import React, { useState, useEffect } from 'react';
import { LoginButton } from '@inrupt/solid-ui-react';
import { SOLID_IDENTITY_PROVIDER } from '../../utils';

/**
 * Login Component - Component that generates Login section for users to a
 * Solid Pod via Solid Session
 * @memberof Login
 * @component
 * @name Login
 */

const Login = () => {
  const [currentUrl, setCurrentUrl] = useState('http://localhost:3000');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, [setCurrentUrl]);

  return (
    <section id="login" className="panel">
      <div className="col s12">
        <div className="card horizontal">
          <div className="card-stacked">
            <div className="card-content">
              <div className="section no-pad-bot row center">
                <label id="labelLogin" htmlFor="btnLogin">
                  Click the following login button to log into your pod at [
                  <a href={SOLID_IDENTITY_PROVIDER} target="_blank" rel="noreferrer">
                    {SOLID_IDENTITY_PROVIDER}
                  </a>
                  ]:{' '}
                </label>
                <LoginButton
                  oidcIssuer={SOLID_IDENTITY_PROVIDER}
                  redirectUrl={currentUrl}
                  onError={console.error}
                >
                  <button type="submit" className="waves-effect waves-light btn">
                    Login
                  </button>
                </LoginButton>
                <p>Not logged in</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
