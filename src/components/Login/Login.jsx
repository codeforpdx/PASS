/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import { LoginButton } from '@inrupt/solid-ui-react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
// import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { SOLID_IDENTITY_PROVIDER } from '../../utils';

/**
 * Login Component - Component that generates Login section for users to a
 * Solid Pod via Solid Session
 *
 * @memberof Login
 * @name Login
 */

const Login = () => {
  const [currentUrl, setCurrentUrl] = useState('http://localhost:3000');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, [setCurrentUrl]);

  // const theme = createTheme();
  const theme = createTheme({
    palette: {
      primary: {
        light: '##039686',
        main: '#017969',
        dark: '##004d3e',
        contrastText: '#fff'
      },
      secondary: {
        light: '#b32126',
        main: '#961020',
        dark: '#790111',
        contrastText: '#fff'
      },
      tertiary: {
        light: '#29ab4c',
        main: '#128a38',
        dark: '#005a1a',
        contrastText: '#fff'
      },
      status: {
        danger: '#e53e3e'
      },
      neutral: {
        main: '#64748B',
        contrastText: '#fff'
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      {/* <CssBaseline /> */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            {/* <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton> */}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Getting Started with PASS
            </Typography>
            {/* <Button color="inherit">Login</Button> */}
          </Toolbar>
        </AppBar>
      </Box>
      <Container component="main" maxWidth="xs">
        {/* <Container> */}
        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <section id="login" className="panel">
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
              <Button variant="contained" type="submit" color="secondary" size="large">
                Login
              </Button>
            </LoginButton>
            <p>Not logged in</p>
          </section>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
