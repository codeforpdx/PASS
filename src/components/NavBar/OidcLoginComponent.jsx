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
import Autocomplete from '@mui/material/Autocomplete';
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
  const SUGGESTED_OIDC_OPTIONS = ENV.VITE_SUGGESTED_OIDC_OPTIONS?.split(', ') || [
    'http://localhost:3000/'
  ];
  const defaultOidc = ENV.VITE_SOLID_IDENTITY_PROVIDER || SUGGESTED_OIDC_OPTIONS[0];
  const [selectedOidcFromDropdown, setSelectedOidcFromDropdown] = useState(defaultOidc);
  const [oidcIssuer, setOidcIssuer] = useState(defaultOidc);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  const loginHandler = async () => {
    const redirectUrl = window.location.href;
    localStorage.setItem('oidcIssuer', oidcIssuer);
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
        gap: '20px',
        width: isSmallScreen ? '100%' : null
      }}
    >
      <Autocomplete
        id="pod-server-url"
        sx={{
          width: isSmallScreen ? null : '300px',
          marginBottom: isSmallScreen && dropdownIsOpen ? '150px' : '0'
        }}
        fullWidth={isSmallScreen}
        options={SUGGESTED_OIDC_OPTIONS}
        size="small"
        freeSolo
        includeInputInList
        disablePortal
        selectOnFocus
        autoHighlight
        blurOnSelect
        openOnFocus
        onOpen={() => setDropdownIsOpen(true)}
        onClose={() => setDropdownIsOpen(false)}
        value={selectedOidcFromDropdown}
        inputValue={oidcIssuer}
        onChange={(_, newValue) => {
          // This is called when the user selects a new option from the dropdown
          setSelectedOidcFromDropdown(newValue);
        }}
        onInputChange={(_, newInputValue) => {
          setOidcIssuer(newInputValue);
        }}
        ListboxProps={{ style: { maxHeight: '12rem' } }}
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
              borderRadius: '8px',
              border: isSmallScreen ? '1px solid grey' : ''
            }}
          />
        )}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : 'row',
          gap: '10px',
          width: isSmallScreen ? '100%' : null
        }}
      >
        {isSmallScreen && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => setShowSignInModal(false)}
            fullWidth
          >
            Cancel
          </Button>
        )}
        <Button
          variant="contained"
          type="submit"
          color={isSmallScreen ? 'primary' : 'secondary'}
          size={isSmallScreen ? '' : 'large'}
          onClick={() => loginHandler()}
          fullWidth={isSmallScreen}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default OidcLoginComponent;
