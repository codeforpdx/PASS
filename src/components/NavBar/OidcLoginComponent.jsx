// React Imports
import React, { useState } from 'react';
// Custom Hook Imports
import { useSession } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// Constants Imports
import { ENV } from '../../constants';

/**
 * The OidcLoginComponent is a component that renders the login button for PASS
 * and linked to the login of a specific Solid IDP
 *
 * @memberof NavBar
 * @name OidcLoginComponent
 * @returns {React.JSX.Element} - The OidcLoginComponent Component
 */
const OidcLoginComponent = () => {
  const { login } = useSession();
  const defaultOidc = ENV.VITE_SOLID_IDENTITY_PROVIDER || '';
  const [oidcIssuer, setOidcIssuer] = useState(defaultOidc);
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
        onKeyUp={(event) => {
          if (event.key === 'Enter') {
            loginHandler();
            localStorage.setItem('oidcIssuer', oidcIssuer);
          }
        }}
        InputProps={{
          disableUnderline: true
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
        onClick={() => {
          loginHandler();
          localStorage.setItem('oidcIssuer', oidcIssuer);
        }}
      >
        Login
      </Button>
    </>
  );
};

export default OidcLoginComponent;
