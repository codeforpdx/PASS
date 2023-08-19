// React Imports
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
// Inrupt Imports
import {
  createAcl,
  createContainerAt,
  getResourceAcl,
  getSolidDatasetWithAcl,
  getThing,
  getWebIdDataset,
  setAgentDefaultAccess,
  setAgentResourceAccess,
  saveAclFor,
  getStringNoLocale
} from '@inrupt/solid-client';
import { FOAF } from '@inrupt/vocab-common-rdf';
// Material UI imports
import { TextField, Button, CardHeader } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// Hooks
import useContactsList from '@hooks/useContactsList';
import useSession from '@hooks/useSession';

import { ENV } from '@constants';

const formRowStyle = {
  margin: '20px 0'
};

const textFieldStyle = {
  margin: '8px'
};

const cardStyle = {
  padding: '8px',
  margin: '8px',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
};

const registerPod = async ({ email, password, confirmPassword }, oidcProvider) => {
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

const initializePod = async (webId, podUrl, caseManagerWebId, fetch) => {
  try {
    await createContainerAt(`${podUrl}PASS`, { fetch });
  } finally {
    const datasetWithAcl = await getSolidDatasetWithAcl(`${podUrl}PASS/`, { fetch });
    let acl = getResourceAcl(datasetWithAcl) ?? createAcl(datasetWithAcl);

    acl = setAgentResourceAccess(acl, webId, {
      read: true,
      append: true,
      write: true,
      control: true
    });
    acl = setAgentDefaultAccess(acl, webId, {
      read: true,
      append: true,
      write: true,
      control: true
    });

    if (caseManagerWebId) {
      acl = setAgentResourceAccess(acl, caseManagerWebId, {
        read: true,
        append: true,
        write: true,
        control: false
      });
      acl = setAgentDefaultAccess(acl, caseManagerWebId, {
        read: true,
        append: true,
        write: true,
        control: false
      });
    }
    await saveAclFor(datasetWithAcl, acl, { fetch });
  }
};

const ShowNewPod = ({ oidcIssuer }) => {
  const { session } = useSession();
  const { data, isSuccess } = useContactsList();

  return (
    <Typography>
      <h1>You have successfully registered for a pod.</h1>
      <br />
      You can find your pod here: {oidcIssuer}
      <br />
      Your webId is: {session.info.webId}
      <br />
      {isSuccess && data.length > 0
        ? `You have registered with ${data[0].person}`
        : 'You have not registered with a case manager'}
    </Typography>
  );
};

const PodRegistrationForm = ({ register, caseManagerName }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [searchParams] = useSearchParams();
  const handleSubmit = async (event) => {
    event.preventDefault();
    register(email, password, confirmPassword);
  };

  return (
    <>
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
      {searchParams.get('webId') ? (
        <p>You will register with {caseManagerName ?? searchParams.get('webId')}</p>
      ) : (
        <p>You are not registering with anyone</p>
      )}

      <Card variant="outlined" sx={cardStyle}>
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
            required
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
            required
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
            required
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
    </>
  );
};

/**
 * Signup - First screen in the user registration flow.
 * Allows users to either create a pod, or sign into an existing pod
 *
 * @memberof Pages
 * @name Signup
 * @returns {React.Component} - A react page
 */
const Signup = () => {
  const [oidcIssuer] = useState(ENV.VITE_SOLID_POD_SERVER || ENV.VITE_SOLID_IDENTITY_PROVIDER);
  const [searchParams] = useSearchParams();
  const caseManagerWebId = decodeURIComponent(searchParams.get('webId'));
  const [caseManagerName, setCaseManagerName] = useState();
  const { session, login, podUrl } = useSession();
  const { addContact, isSuccess } = useContactsList();

  const registerAndLogin = async (email, password, confirmPassword) => {
    await registerPod(
      {
        email,
        password,
        confirmPassword
      },
      oidcIssuer
    );

    await login({
      oidcIssuer,
      redirectUrl: window.location.href,
      clientName: 'PASS Registration'
    });
  };

  const loadProfileInfo = async () => {
    try {
      const profile = await getWebIdDataset(caseManagerWebId);
      const profileThing = getThing(profile, caseManagerWebId);
      setCaseManagerName(getStringNoLocale(profileThing, FOAF.name));
    } catch {
      setCaseManagerName(null);
    }
  };

  useEffect(() => {
    loadProfileInfo();
  }, []);

  useEffect(() => {
    if (session.info?.isLoggedIn)
      initializePod(session.info.webId, podUrl, caseManagerWebId, session.fetch);
  }, [session.info.isLoggedIn]);

  useEffect(() => {
    if (isSuccess && caseManagerWebId) {
      const [cmFirstName, cmLastName] = caseManagerName?.split(' ') ?? [null, null];
      addContact({
        givenName: cmFirstName,
        familyName: cmLastName,
        webId: caseManagerWebId
      });
    }
  }, [isSuccess]);

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
          {session.info.isLoggedIn ? (
            <ShowNewPod oidcIssuer={oidcIssuer} />
          ) : (
            <PodRegistrationForm register={registerAndLogin} caseManagerName={caseManagerName} />
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
