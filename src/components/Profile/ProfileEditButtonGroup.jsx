// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import EditNote from '@mui/icons-material/EditNote';

/**
 * The ProfileEditButtonGroup Component is a component that consist of the profile
 * page edit buttons for the ProfileInputField component
 *
 * @memberof Profile
 * @name ProfileEditButtonGroup
 * @param {object} Props - Props for Profile Edit buttons
 * @param {boolean} Props.edit - Boolean state for editing values in the
 * ProfileInputField component
 * @param {() => void} Props.handleCancelEdit - Handler function for canceling
 * edit for ProfileInputField component
 * @param {() => void} Props.handleEditInput - Handler function for editing the
 * ProfileInputField component
 * @returns {React.JSX.Element} The ProfileEditButtonGroup
 */
const ProfileEditButtonGroup = ({ edit, handleCancelEdit, handleEditInput }) => (
  <Box
    sx={{
      display: 'flex',
      gap: '10px',
      alignSelf: 'end'
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
      <IconButton type="button" color="primary" onClick={handleEditInput}>
        <EditNote />
      </IconButton>
    )}
  </Box>
);

export default ProfileEditButtonGroup;
