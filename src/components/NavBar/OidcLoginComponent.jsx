// React Imports
import React, { useState } from 'react';
// Inrupt Library Imports
import { LoginButton } from '@inrupt/solid-ui-react';
// Material UI Imports
import { TextField, Box, Button } from '@mui/material';
// Constants Imports
import { ENV } from '../../constants';

const OidcLoginComponent = () => {
  const defaultOidc = ENV.VITE_SOLID_IDENTITY_PROVIDER || ''
  const [oidcIssuer, setOidcIssuer] = useState(defaultOidc);

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
      <LoginButton
        oidcIssuer={oidcIssuer}
        redirectUrl={`${window.location.origin}/PASS/`}
      >
        <Button
          variant="contained"
          type="submit"
          color="secondary"
          size="large"
          aria-label="Login Button"
          onClick={() => {
            localStorage.setItem('oidcIssuer', oidcIssuer);
          }}
        >
          Login
        </Button>
      </LoginButton>
    </>
  );
};

export default OidcLoginComponent;
