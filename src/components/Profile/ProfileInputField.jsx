// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';

/**
 * @typedef {import("../../typedefs").profileInputFieldProps} profileInputFieldProps
 */

/**
 * ProfileInputField Component - Component that creates the editable inputs fields
 * for the Profile page
 *
 * @memberof Profile
 * @name ProfileInputField
 * @param {profileInputFieldProps} Props - Props used for NewMessage
 * @returns {React.JSX.Element} React component for NewMessage
 */
const ProfileInputField = ({ inputName, inputValue, setInputValue, edit }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <InputLabel htmlFor={`input-${inputName}`} sx={{ color: 'black' }}>
      {inputName}:
    </InputLabel>
    <Input
      id={`input-${inputName}`}
      value={inputValue || ''}
      placeholder={inputValue || 'No value set'}
      disabled={!edit}
      onChange={(e) => setInputValue(e.target.value)}
    />
  </Box>
);

export default ProfileInputField;
