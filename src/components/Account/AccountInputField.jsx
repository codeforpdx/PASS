// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';

/**
 * AccountInputField Component - Component that creates the editable input fields
 * for the Account page
 *
 * @memberof Profile
 * @name AccountInputField
 * @param {object} Props - Props used for AccountInputField
 * @param {string} Props.inputName - Name of input field
 * @param {string} Props.inputValue - Value of input field used for updating account
 * @param {(value: React.SetStateAction<string|null>) => void} Props.setInputValue
 * - Set function for inputValue
 * @param {boolean} Props.edit - Boolean used to toggle edit inputs
 * @returns {React.JSX.Element} React component for AccountInputField
 */
const AccountInputField = ({ inputName, inputValue, setInputValue, edit }) => (
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

export default AccountInputField;
