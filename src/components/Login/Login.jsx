import React from 'react';
import { LoginButton } from '@inrupt/solid-ui-react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { useRedirectUrl } from '../../hooks';
import { SOLID_IDENTITY_PROVIDER } from '../../utils';
import AppHeader from '../AppHeader';
import Footer from '../Footer/Footer';

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
    <Box sx={{minHeight: '100vh'}}>
      <AppHeader />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '20px'
          }}
        >
          <Paper elevation={2} sx={{ display: 'inline-block', mx: '2px', padding: '20px' }}>
            <section id="login">
              <label id="labelLogin">
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
              >
                {' '}
                <Button variant="contained" type="submit" color="secondary" size="large">
                  Login
                </Button>
              </LoginButton>
              <p>Not logged in</p>
            </section>
          </Paper>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Login;
