import React from 'react';
import { LoginButton } from '@inrupt/solid-ui-react';
import { SOLID_IDENTITY_PROVIDER } from '../../utils';

/**
 * Login Component - Component that generates Login section for users to a
 * Solid Pod via Solid Session
 *
 * @memberof Login
 * @name Login
 */

const Login = ({ redirectUrl }) => (
  <section id="login" className="panel">
    <div className="row">
      <label id="labelLogin" htmlFor="btnLogin">
        Click the following login button to log into your pod at [
        <a href={SOLID_IDENTITY_PROVIDER} target="_blank" rel="noreferrer">
          {SOLID_IDENTITY_PROVIDER}
        </a>
        ]:{' '}
      </label>
      <LoginButton
        oidcIssuer={SOLID_IDENTITY_PROVIDER}
        redirectUrl={redirectUrl}
        onError={console.error}
      />
      <p>Not logged in</p>
    </div>
  </section>
);

export default Login;
