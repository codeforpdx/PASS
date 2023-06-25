// React Imports
import React, { useState, useEffect } from 'react';
import { TextField, Button, CardHeader, textFieldClasses } from '@mui/material';

import {
  login,
  getDefaultSession,
  handleIncomingRedirect
} from '@inrupt/solid-client-authn-browser';

import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { registerPod, subscribeToUser } from '../utils';
import { OidcLoginComponent } from '../components/NavBar';

/**
 * Signup - First screen in the user registration flow.
 * Allows users to either create a pod, or sign into an existing pod
 *
 * @memberof Forms
 * @name ManageUsers
 */

const formRowStyle = {
  margin: '20px 0'
};

const textFieldStyle = {
  margin: '8px'
};

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [searchParams] = useSearchParams();
  const [oidcIssuer, setOidcIssuer] = useState('');
  const registerAndSubscribe = async () => {
    const caseManagerPodUrl = searchParams.get('podUrl');

    const { webId, podBaseUrl } = await registerPod({
      email,
      password,
      confirmPassword
    });

    await subscribeToUser(`${caseManagerPodUrl}PASS/`, {
      myWebId: webId,
      myPodUrl: podBaseUrl,
      myEmail: email
    });
  };

  // Event handler for adding user from users list
  const handleSubmit = async (event) => {
    event.preventDefault();
    registerAndSubscribe();
  };

  const startLogin = async () => {
    await login({
      oidcIssuer,
      redirectUrl: window.location.href,
      clientName: 'PASS Registration'
    });
  };

  const completeLogin = async () => {
    const sessionInfo = await handleIncomingRedirect();
    console.log(sessionInfo);
  };

  useEffect(() => {
    completeLogin();
  }, []);

  return (
    <Container>
      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Paper
          elevation={2}
          sx={{
            display: 'inline-block',
            mx: '2px',
            padding: '20px',
            minWidth: '400px',
            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
          }}
        >
          <Typography
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={2}
            variant="h5"
            component="h3"
          >
            Register For PASS
          </Typography>
          <p>You will register with {searchParams.get('podUrl')}</p>
          <Card
            variant="outlined"
            sx={{
              padding: '8px',
              margin: '8px',
              boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
            }}
          >
            <CardHeader title="Set Up a New Pod" />

            <form onSubmit={handleSubmit} style={formRowStyle} autoComplete="off">
              <TextField
                style={textFieldStyle}
                id="email-form"
                aria-label="Email"
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
              <TextField
                style={textFieldStyle}
                id="password-form"
                aria-label="Password"
                label="Password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <TextField
                style={textFieldStyle}
                id="confirm-password-form"
                aria-label="Confirm Password"
                label="Confirm Password"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <br />
              <Button
                variant="contained"
                color="primary"
                size="large"
                aria-label="Sign Up For a Pod"
                type="submit"
              >
                Set up your Pod
              </Button>
            </form>
          </Card>
          <Card
            variant="outlined"
            sx={{
              margin: '8px',
              padding: '8px',
              boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
            }}
          >
            <CardHeader title="Use an Existing Pod" />
            <TextField
              style={textFieldStyle}
              id="oidc-issuer-field"
              aria-label="Enter Pod OIDC Issuer"
              label="Oidc Issuer"
              value={oidcIssuer}
              onChange={(e) => setOidcIssuer(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              aria-label="Sign Into Pod"
              onClick={(e) => {
                e.preventDefault();
                startLogin();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  startLogin();
                }
              }}
            >
              Sign Into Pod
            </Button>
          </Card>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
