// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';

/**
 * The AccountEditButtonGroup Component is a component that consist of the account
 * page edit buttons for the AccountInputField component
 *
 * @memberof Profile
 * @name AccountEditButtonGroup
 * @param {object} Props - Props for Account Edit buttons
 * @param {boolean} Props.edit - Boolean state for editing values in the
 * AccountInputField component
 * @param {() => void} Props.handleCancelEdit - Handler function for canceling
 * edit for AccountInputField component
 * @param {() => void} Props.handleEditInput - Handler function for editing the
 * AccountInputField component
 * @returns {React.JSX.Element} The AccountEditButtonGroup
 */
const AccountEditButtonGroup = ({ edit, handleCancelEdit, handleEditInput }) => (
  <Box
    sx={{
      display: 'flex',
      gap: '10px',
      marginTop: '10px'
    }}
  >
    {edit ? (
      <>
        <Button
          variant="outlined"
          type="button"
          color="error"
          endIcon={<ClearIcon />}
          onClick={handleCancelEdit}
          sx={{ width: '100px' }}
        >
          Cancel
        </Button>
        <Button variant="outlined" type="submit" endIcon={<CheckIcon />} sx={{ width: '100px' }}>
          Update
        </Button>
      </>
    ) : (
      <Button
        variant="outlined"
        type="button"
        color="primary"
        endIcon={<EditIcon />}
        onClick={handleEditInput}
        sx={{ width: '100px' }}
      >
        Edit
      </Button>
    )}
  </Box>
);

export default AccountEditButtonGroup;
