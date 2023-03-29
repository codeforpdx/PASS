/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import { LoginButton } from '@inrupt/solid-ui-react';
// import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
// import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SOLID_IDENTITY_PROVIDER } from '../../utils';
// import Card from '@mui/material/Card';

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

  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <section id="login" className="panel">
            {/* <div className="row"> */}
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
              <Button variant="contained" type="submit" color="success" size="large">
                Login
              </Button>
            </LoginButton>
            <p>Not logged in</p>
            {/* </div> */}
          </section>
        </Box>
      </Container>
    </ThemeProvider>

    // <ThemeProvider theme={theme}>
    //   <Container component="main" maxWidth="xs">
    //     <CssBaseline />
    //     <Box
    //       sx={{
    //         marginTop: 8,
    //         display: 'flex',
    //         flexDirection: 'column',
    //         alignItems: 'center'
    //       }}
    //     >
    //       <Typography component="h1" variant="h5">
    //         Getting started with PASS
    //       </Typography>

    //       <label id="labelLogin" htmlFor="btnLogin">
    //         Click the following login button to log into your pod at [
    //         <a href={SOLID_IDENTITY_PROVIDER} target="_blank" rel="noreferrer">
    //           {SOLID_IDENTITY_PROVIDER}
    //         </a>
    //         ]:{' '}
    //       </label>
    //       {/* Version 1 */}
    //       <button type="submit">Login</button>
    //       <Box component="form" noValidate sx={{ mt: 1 }}>
    //         {/* Version 2 */}
    //         <LoginButton
    //           oidcIssuer={SOLID_IDENTITY_PROVIDER}
    //           redirectUrl={currentUrl}
    //           onError={console.error}
    //         >
    //           <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
    //             Sign In
    //           </Button>
    //         </LoginButton>
    //         {/* Version 3 */}
    //         <LoginButton
    //           oidcIssuer={SOLID_IDENTITY_PROVIDER}
    //           redirectUrl={currentUrl}
    //           onError={console.error}
    //         >
    //           <button type="submit">Login</button>
    //         </LoginButton>

    //         <p>Not logged in</p>
    //       </Box>
    //     </Box>
    //     <Footer sx={{ mt: 8, mb: 4 }} />
    //   </Container>
    // </ThemeProvider>
  );
};

export default Login;
