// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';

/**
 * @typedef {import("../../typedefs.js").profileEditButtonGroupProps} profileEditButtonGroupProps
 */

/**
 * The ProfileEditButtonGroup Component is a component that consist of the profile
 * page edit buttons for the ProfileInputField component
 *
 * @memberof Profile
 * @name ProfileEditButtonGroup
 * @param {profileEditButtonGroupProps} Props - Props for Profile Edit buttons
 * @returns {React.JSX.Element} The ProfileEditButtonGroup
 */
const ProfileEditButtonGroup = ({ edit, handleCancelEdit, handleEditInput }) => (
  <Box
    sx={{
      display: 'flex',
      gap: '10px'
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

export default ProfileEditButtonGroup;
