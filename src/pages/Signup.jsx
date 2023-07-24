// React Imports
import React, { useState, useEffect } from 'react';
import { TextField, Button, CardHeader } from '@mui/material';

import {
  buildThing,
  createThing,
  getPodUrlAll,
  mockSolidDatasetFrom,
  saveSolidDatasetAt,
  setThing,
} from '@inrupt/solid-client';

import { RDF_PREDICATES } from '@constants';

import { login, handleIncomingRedirect } from '@inrupt/solid-client-authn-browser';

import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { fetchProfileInfo } from '../model-helpers';

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

export const registerPod = async (
  { email, password, confirmPassword },
  oidcProvider = import.meta.env.VITE_SOLID_POD_SERVER
) => {
  const [podName] = email.split('@');

  const oidcRegistrationPath = `${oidcProvider}idp/register/`;

  const body = {
    email,
    password,
    confirmPassword,
    podName,
    createWebId: true,
    createPod: true,
    rootPod: false,
    register: true
  };

  const response = await fetch(oidcRegistrationPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return response.json();
};

export const subscribeToUser = async (userPodUrl, myProfile) => {
  const { myWebId, myPodUrl, myUsername } = myProfile;
  const thing = buildThing(createThing({ name: myUsername }))
    .addUrl(RDF_PREDICATES.identifier, myWebId)
    .addUrl(RDF_PREDICATES.URL, myPodUrl)
    .build();
  const datasetUrl = `${userPodUrl}Users/userlist.ttl`;
  // Inrupt's libraries don't seem to support append-only access to datasets normally.
  // mockSolidDatasetFrom is a workaround
  let dataset = mockSolidDatasetFrom(datasetUrl);
  dataset = setThing(dataset, thing);
  await saveSolidDatasetAt(datasetUrl, dataset);
};

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [searchParams] = useSearchParams();
  const [oidcIssuer, setOidcIssuer] = useState('');
  const caseManagerWebId = decodeURIComponent(searchParams.get('webId'));
  const [ caseManagerPodUrl, setCaseManagerPodUrl ] = useState('');
  const [profileData, setProfileData] = useState({}); 
  const registerAndSubscribe = async () => {

    const { webId, podBaseUrl } = await registerPod({
      email,
      password,
      confirmPassword
    });

    const username = email.split('@');

    await subscribeToUser(`${caseManagerPodUrl}PASS/`, {
      myWebId: webId,
      myPodUrl: podBaseUrl,
      myUsername: username
    });
  };

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
    if (sessionInfo?.isLoggedIn) {
      let [podUrl] = await getPodUrlAll(sessionInfo.webId);
      podUrl = podUrl ?? sessionInfo.webId.split('profile')[0];
      const username = sessionInfo.webId;

      await subscribeToUser(`${caseManagerPodUrl}PASS/`, {
        myWebId: sessionInfo.webId,
        myPodUrl: podUrl,
        myUsername: username
      });
    }
  };

  const loadProfile = async () => {
    setCaseManagerPodUrl(caseManagerWebId.split('profile'));
    const profile = await fetchProfileInfo(caseManagerWebId);
    setProfileData(profile.profileInfo);
  }

  useEffect(() => {
    loadProfile();
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
          <p>You will register with {profileData.profileName ?? searchParams.get('webId')}</p>
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
