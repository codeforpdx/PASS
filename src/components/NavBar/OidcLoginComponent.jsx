// React Imports
import React, { useState, useRef } from 'react';
// Inrupt Library Imports
import { LoginButton } from '@inrupt/solid-ui-react';
// Material UI Imports
import { TextField, Box, Button } from '@mui/material';
// Custom Hook Imports
import { useRedirectUrl } from '../../hooks';
// Constants Imports
import { ENV } from '../../constants';

const OidcLoginComponent = () => {
  const [oidcIssuer, setOidcIssuer] = useState(ENV.VITE_SOLID_IDENTITY_PROVIDER);
  const redirectUrl = useRedirectUrl();
  const buttonRef = useRef(null)

  return (
    <>
      <Box sx={{ flexGrow: 1 }} />
      <TextField
        type="text"
        label="Pod Server URL"
        variant="filled"
        value={oidcIssuer}
        onChange={(e) => setOidcIssuer(e.target.value)}
        onKeyUp={(e) => {
          if(e.key === 'Enter') buttonRef.current.click()
        }}
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
      <LoginButton oidcIssuer={oidcIssuer} redirectUrl={redirectUrl}>
        <Button
          variant="contained"
          type="submit"
          color="secondary"
          size="large"
          aria-label="Login Button"
          ref={buttonRef}
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
