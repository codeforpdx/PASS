// React Imports
import React, { useState } from 'react';
// Inrupt Library Imports
import { useSession } from '@hooks';
// Material UI Imports
import { TextField, Box, Button } from '@mui/material';
// Constants Imports
import { ENV } from '../../constants';

const OidcLoginComponent = () => {
  const { login } = useSession();
  const defaultOidc = ENV.VITE_SOLID_IDENTITY_PROVIDER || '';
  const [oidcIssuer, setOidcIssuer] = useState(defaultOidc);
  localStorage.setItem('oidcIssuer', oidcIssuer);
  const loginHandler = async () => {
    const redirectUrl = window.location.href;
    await login({ oidcIssuer, redirectUrl });
  };
  return (
    <>
      <Box sx={{ flexGrow: 1 }} />
      <TextField
        type="text"
        label="Pod Server URL"
        variant="filled"
        value={oidcIssuer}
        onChange={(e) => setOidcIssuer(e.target.value)}
        InputProps={{
          disableUnderline: true,
          'aria-label': 'OIDC Input Field'
        }}
        sx={{
          backgroundColor: 'white',
          borderRadius: '8px'
        }}
      />
      <Box sx={{ marginRight: '32px' }} />
      <Button
        variant="contained"
        type="submit"
        color="secondary"
        size="large"
        aria-label="Login Button"
        onClick={() => {
          loginHandler();
        }}
        onKeyUp={(event) => {
          if (event.key === 'Enter') {
            loginHandler();
          }
        }}
      >
        Login
      </Button>
    </>
  );
};

export default OidcLoginComponent;
