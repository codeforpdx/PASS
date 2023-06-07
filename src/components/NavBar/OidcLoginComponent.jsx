import React, { useState } from 'react';
import { TextField, Box, Button } from '@mui/material';
import { LoginButton } from '@inrupt/solid-ui-react';

// Utility Imports
import { SOLID_IDENTITY_PROVIDER } from '../../utils';

// Custom Hook Imports
import { useRedirectUrl } from '../../hooks';

const OidcLoginComponent = () => {
  const [oidcIssuer, setOidcIssuer] = useState(SOLID_IDENTITY_PROVIDER);
  const redirectUrl = useRedirectUrl();

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
      <LoginButton oidcIssuer={oidcIssuer} redirectUrl={redirectUrl}>
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
