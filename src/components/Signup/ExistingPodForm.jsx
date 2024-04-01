import React, { useState } from 'react';

// Custom Hook Imports
import { useSession } from '@hooks';

// MUI imports
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

/* Styles for MUI components */
const cardStyle = {
  padding: '8px',
  margin: '8px',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
};

const formRowStyle = {
  margin: '20px 0'
};

const textFieldStyle = {
  margin: '8px'
};

const ExistingPodForm = () => {
  const { login } = useSession();

  const [provider, setProvider] = useState('https://inrupt.net/');

  const loginHandler = async (event) => {
    event.preventDefault();
    console.log(provider, 'user entered Pod provider url');

    let redirectUrl = new URL(window.location.href);
    redirectUrl = redirectUrl.toString();

    localStorage.setItem('oidcIssuer', provider);
    await login({
      provider,
      redirectUrl
    });
  };

  return (
    <Card style={cardStyle}>
      <CardHeader title="Register with Existing Pod" />
      <form onSubmit={loginHandler} style={formRowStyle}>
        <TextField
          id="existing-pod-provider"
          style={textFieldStyle}
          aria-label="Email"
          label="Pod Provider"
          variant="outlined"
          onChange={(e) => setProvider(e.target.value)}
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
    </Card>
  );
};

export default ExistingPodForm;
