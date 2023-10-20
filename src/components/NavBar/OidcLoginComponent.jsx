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
import { ENV, SUGGESTED_OIDC_OPTIONS } from '../../constants';

const OidcLoginComponent = () => {
  const { login } = useSession();
  const defaultOidc = ENV.VITE_SOLID_IDENTITY_PROVIDER || SUGGESTED_OIDC_OPTIONS[0];
  const [selectedOidcFromDropdown, setSelectedOidcFromDropdown] = useState(defaultOidc);
  const [oidcIssuer, setOidcIssuer] = useState(defaultOidc);
  const loginHandler = async () => {
    const redirectUrl = window.location.href;
    await login({ oidcIssuer, redirectUrl });
  };
  const saveOidcIssuer = (value) => {
    if (value === null || value?.length < 0) return;
    localStorage.setItem('oidcIssuer', value);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} />
      <Autocomplete
        id="pod-server-url"
        options={SUGGESTED_OIDC_OPTIONS}
        size="small"
        sx={{ width: '200px' }}
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
          saveOidcIssuer(newValue);
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
            onBlur={(e) => saveOidcIssuer(e.target.value)}
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
