// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';

/**
 * messageFolderProps is an object that stores the props for the MessageFolder
 * component
 *
 * @typedef profileInputFieldProps
 * @type {object}
 * @property {string} inputName - Name of input field
 * @property {string} inputValue - Value of input field used for updating profile
 * @property {boolean} editInputValue - Boolean for editing input value
 * @property {(value: React.SetStateAction<null>) => void} setInputValue - Set
 * function for inputValue
 * @property {() => void} handleEditInput - Handler function for editing input
 * @property {() => void} handleCancelEdit - Handler function for cancelling edit
 * @memberof typedefs
 */

/**
 * New Message Component - Component that allows user to write
 *  a message to another user from their inbox
 *
 * @memberof Inbox
 * @name ProfileInputField
 * @param {profileInputFieldProps} Props - Props used for NewMessage
 * @returns {React.JSX.Element} React component for NewMessage
 */
const ProfileInputField = ({
  inputName,
  inputValue,
  editInputValue,
  setInputValue,
  handleEditInput,
  handleCancelEdit
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {editInputValue ? (
        <>
          <Typography>{inputName}: </Typography>
          <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        </>
      ) : (
        <Typography>
          {inputName}: {inputValue}
        </Typography>
      )}
      <Button
        variant="outlined"
        type="button"
        onClick={editInputValue ? handleCancelEdit : handleEditInput}
      >
        {editInputValue ? 'Cancel' : 'Edit'}
      </Button>
    </Box>
    {editInputValue && (
      <Button variant="outlined" type="submit">
        Update
      </Button>
    )}
  </Box>
);

export default ProfileInputField;
