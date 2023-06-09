// React Imports
import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { registerPod, subscribeToUser } from '../utils';
import { OidcLoginComponent } from '../components/NavBar';

/**
 * ManageUsers Component - Component that allows users to manage other user's
 * Pod URLs from a user's list stored on their own Pod
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
          sx={{ display: 'inline-block', mx: '2px', padding: '20px', minWidth: '400px' }}
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
          <form onSubmit={handleSubmit} style={formRowStyle} autoComplete="off">
            <p>Set up a new pod:</p>
            <p>You will register with {searchParams.get('podUrl')}</p>
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
            <hr />
            <p>Or use an existing Pod:</p>
            <br />
            <OidcLoginComponent />
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
