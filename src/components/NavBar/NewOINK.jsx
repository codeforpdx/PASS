// React Imports
import React, { useState } from 'react';
// Custom Hook Imports
import { useSession } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
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
  const SUGGESTED_OIDC_OPTIONS = ENV.VITE_SUGGESTED_OIDC_OPTIONS.split(', ');
  const defaultOidc = ENV.VITE_SOLID_IDENTITY_PROVIDER || SUGGESTED_OIDC_OPTIONS[0];
  const [selectedOidcFromDropdown, setSelectedOidcFromDropdown] = useState(defaultOidc);
  const [oidcIssuer, setOidcIssuer] = useState(defaultOidc);

  const loginHandler = async () => {
    const redirectUrl = window.location.href;
    localStorage.setItem('oidcIssuer', oidcIssuer);
    await login({ oidcIssuer, redirectUrl });
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} />
      <Autocomplete
        id="pod-server-url"
        sx={{
          minWidth: '130px',
          maxWidth: '400px'
        }}
        fullWidth
        options={SUGGESTED_OIDC_OPTIONS}
        size="small"
        freeSolo
        includeInputInList
        disablePortal
        selectOnFocus
        autoHighlight
        blurOnSelect
        openOnFocus
        value={selectedOidcFromDropdown}
        inputValue={oidcIssuer}
        onChange={(_, newValue) => {
          // This is called when the user selects a new option from the dropdown
          setSelectedOidcFromDropdown(newValue);
        }}
        onInputChange={(_, newInputValue) => {
          setOidcIssuer(newInputValue);
        }}
        renderInput={(renderParams) => (
          <TextField
            {...renderParams}
            type="text"
            label="Pod Server URL"
            variant="filled"
            InputProps={{
              ...renderParams.InputProps,
              disableUnderline: true
            }}
            sx={{
              backgroundColor: 'white',
              borderRadius: '8px'
            }}
          />
        )}
      />
      <Box sx={{ marginRight: '32px' }} />
      <Button
        variant="contained"
        type="submit"
        color="secondary"
        size="large"
        sx={{ flexShrink: 0 }}
        onClick={() => {
          loginHandler();
        }}
      >
        Login
      </Button>
    </>
  );
};

export default OidcLoginComponent;
