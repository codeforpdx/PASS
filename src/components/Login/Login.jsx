import React from 'react';
import { LoginButton } from '@inrupt/solid-ui-react';
import { ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
// import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import theme from '../../theme';
import { useRedirectUrl } from '../../hooks';
import { SOLID_IDENTITY_PROVIDER } from '../../utils';
import AppHeader from '../AppHeader';

/**
 * Login Component - Component that generates Login section for users to a
 * Solid Pod via Solid Session
 *
 * @memberof Login
 * @name Login
 */

const Login = () => {
  const redirectUrl = useRedirectUrl();

  return (
    <>
      <AppHeader />
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
    </>
  );
};

export default Login;
