// React Imports
import React, { useState } from 'react';
// Custom Hook Imports
import { useSession } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
// Constants Imports
import { ENV } from '../../constants';

/**
 * The OidcLoginComponent is a component that renders the login button for PASS
 * and linked to the login of a specific Solid IDP
 *
 * @memberof NavBar
 * @name OidcLoginComponent
 * @param {object} Props - The props for OidcLoginComponent
 * @param {React.Dispatch<React.SetStateAction<boolean>>} Props.setShowSignInModal
 * - The set function for closing sign in modal
 * @returns {React.JSX.Element} - The OidcLoginComponent Component
 */
const OidcLoginComponent = ({ setShowSignInModal }) => {
  const { login } = useSession();
  const defaultOidc = ENV.VITE_SOLID_IDENTITY_PROVIDER || '';
  const [oidcIssuer, setOidcIssuer] = useState(defaultOidc);
  const loginHandler = async () => {
    const redirectUrl = window.location.href;
    await login({ oidcIssuer, redirectUrl });
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isSmallScreen ? 'column' : 'row',
        alignItems: 'center',
        gap: '10px'
      }}
    >
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
          borderRadius: '8px',
          border: isSmallScreen ? '1px solid grey' : '',
          width: '100%'
        }}
      />
      <Box sx={{ display: 'flex', gap: '10px' }}>
        {isSmallScreen ? (
          <Button variant="outlined" color="error" onClick={() => setShowSignInModal(false)}>
            Cancel
          </Button>
        ) : null}
        <Button
          variant="contained"
          type="submit"
          color="secondary"
          size={isSmallScreen ? '' : 'large'}
          onClick={() => {
            loginHandler();
            localStorage.setItem('oidcIssuer', oidcIssuer);
          }}
          sx={{ marginLeft: isSmallScreen ? '0' : '32px' }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default OidcLoginComponent;
