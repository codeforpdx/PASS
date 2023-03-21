/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import { LoginButton } from '@inrupt/solid-ui-react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
// import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SOLID_IDENTITY_PROVIDER } from '../../utils';

/**
 * Login Component - Component that generates Login section for users to a
 * Solid Pod via Solid Session
 * @memberof Login
 * @component
 * @name Login
 */

const Footer = (props) => (
  <Typography variant="body2" color="text.secondary" align="center" {...props}>
    <Link color="inherit" href="https://github.com/codeforpdx/PASS">
      codeForPDX
    </Link>{' '}
    {new Date().getFullYear()}.
  </Typography>
);

const Login = () => {
  const [currentUrl, setCurrentUrl] = useState('http://localhost:3000');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, [setCurrentUrl]);

  const theme = createTheme();

  return (
    // <section id="login" className="panel">
    //   <div className="row">
    //     <label id="labelLogin" htmlFor="btnLogin">
    //       Click the following login button to log into your pod at [
    //       <a href={SOLID_IDENTITY_PROVIDER} target="_blank" rel="noreferrer">
    //         {SOLID_IDENTITY_PROVIDER}
    //       </a>
    //       ]:{' '}
    //     </label>
    //     <LoginButton
    //       oidcIssuer={SOLID_IDENTITY_PROVIDER}
    //       redirectUrl={currentUrl}
    //       onError={console.error}
    //     >
    //       <button type="submit">Login</button>
    //     </LoginButton>
    //     <p>Not logged in</p>

    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            {/* <LockOutlinedIcon /> */}
            <p>PASS</p>
          </Avatar>

          <Typography component="h1" variant="h5">
            Getting started with PASS
          </Typography>

          <label id="labelLogin" htmlFor="btnLogin">
            Click the following login button to log into your pod at [
            <a href={SOLID_IDENTITY_PROVIDER} target="_blank" rel="noreferrer">
              {SOLID_IDENTITY_PROVIDER}
            </a>
            ]:{' '}
          </label>

          <Box component="form" noValidate sx={{ mt: 1 }}>
            {/* <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
             */}

            <LoginButton
              oidcIssuer={SOLID_IDENTITY_PROVIDER}
              redirectUrl={currentUrl}
              onError={console.error}
            >
              {/* <button type="submit">Login</button> */}
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign In
              </Button>
            </LoginButton>

            <p>Not logged in</p>

            {/* <Grid container>
              <Grid item xs>
                <Link href="/" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/" variant="body2">
                  "Don't have an account? Sign Up"
                </Link>
              </Grid>
            </Grid> */}
          </Box>
        </Box>
        <Footer sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default Login;
