// React Imports
import React, { useState } from 'react';
// Custom Hooks Imports
import { useSession } from '@hooks';
// Material UI Imports
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

/* Styles */
const formRowStyle = {
  margin: '20px 0'
};

// TODO: Add JSDocs
const ExistingPodForm = () => {
  const { login } = useSession();

  const [oidcIssuer, setOidcIssuer] = useState('https://inrupt.net/');

  const loginHandler = async (event) => {
    event.preventDefault();

    let redirectUrl = new URL(window.location.href);
    redirectUrl = redirectUrl.toString();

    localStorage.setItem('oidcIssuer', oidcIssuer);
    await login({
      oidcIssuer,
      redirectUrl
    });
  };

  return (
    <Box>
      <form onSubmit={loginHandler} style={formRowStyle}>
        {/* TODO: Consider changing this to Autocomplete like the NavBar and SignInModal have */}
        <TextField
          sx={{ margin: '8px' }}
          id="existing-pod-provider"
          aria-label="Pod Provider"
          label="Pod Provider"
          variant="outlined"
          onChange={(e) => setOidcIssuer(e.target.value)}
          required
        />
        <br />
        <Button
          variant="contained"
          color="primary"
          size="large"
          aria-label="Login to Pod Provider"
          type="submit"
        >
          Login to Pod Provider
        </Button>
      </form>
    </Box>
  );
};

export default ExistingPodForm;
