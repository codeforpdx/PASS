// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';

/**
 * ProfileInputField Component - Component that creates the editable inputs fields
 * for the Profile page
 *
 * @memberof Profile
 * @name ProfileInputField
 * @param {object} Props - Props used for NewMessage
 * @param {string} Props.inputName - Name of input field
 * @param {string} Props.inputValue - Value of input field used for updating profile
 * @param {(value: React.SetStateAction<string|null>) => void} Props.setInputValue
 * - Set function for inputValue
 * @param {boolean} Props.edit - Boolean used to toggle edit inputs
 * @param {React.JSX.Element} Props.endAdornment - optional end adornment for input
 * @returns {React.JSX.Element} React component for NewMessage
 */
const ProfileInputField = ({ inputName, inputValue, setInputValue, edit, endAdornment }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'center' }}>
    <InputLabel htmlFor={`input-${inputName}`} sx={{ color: 'black' }}>
      {inputName}:
    </InputLabel>

    <Input
      sx={{ width: '200px' }}
      id={`input-${inputName}`}
      value={inputValue || ''}
      placeholder={inputValue || 'No value set'}
      disabled={!edit}
      onChange={(e) => setInputValue(e.target.value)}
      endAdornment={endAdornment}
    />
  </Box>
);

export default ProfileInputField;
