import React, { useState } from 'react';
import { Input, Box, Button, InputLabel } from '@mui/material';
import { styled } from '@mui/system';
import { LoginButton } from '@inrupt/solid-ui-react';

// Utility Imports
import { SOLID_IDENTITY_PROVIDER } from '../../utils';

// Custom Hook Imports
import { useRedirectUrl } from '../../hooks';

const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f'
};

const StyledInputElement = styled('input')(
  () => `
    width: 240px;
    font-size: 1rem;
    line-height: 1;
    padding: 12px;
    border-radius: 12px;
    color: ${grey[900]};
    background: ${'#fff'};
    border: 1px solid ${grey[200]};

    &:focus {
      border-color: ${grey[700]};
      border-shadow: ${grey[900]};
    }
  
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

const OidcLoginComponent = () => {
  const [oidcIssuer, setOidcIssuer] = useState(SOLID_IDENTITY_PROVIDER);
  const redirectUrl = useRedirectUrl();

  return (
    <>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />
      <InputLabel
        sx={{
          marginRight: '16px',
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: 'bold'
        }}
      >
        Pod Server URL:
      </InputLabel>
      <Input
        disableUnderline
        slots={{ input: StyledInputElement }}
        name="Identity Issuer"
        value={oidcIssuer}
        onChange={(e) => setOidcIssuer(e.target.value)}
      />
      <Box sx={{ marginRight: '32px' }} />
      <LoginButton oidcIssuer={oidcIssuer} redirectUrl={redirectUrl}>
        <Button
          variant="contained"
          type="submit"
          color="secondary"
          size="large"
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
