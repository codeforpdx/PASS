import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';

const ProfileInputField = ({
  inputName,
  inputValue,
  editInputValue,
  setInputValue,
  handleEditInput
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {editInputValue ? (
        <>
          <Typography>{inputName}: </Typography>
          <Input
            value={inputValue}
            placeholder={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </>
      ) : (
        <Typography>
          {inputName}: {inputValue}
        </Typography>
      )}
      {inputValue && (
        <Button variant="outlined" type="button" onClick={handleEditInput}>
          {editInputValue ? 'Cancel' : 'Edit'}
        </Button>
      )}
    </Box>
    {inputValue && editInputValue && (
      <Button variant="outlined" type="submit">
        Update
      </Button>
    )}
  </Box>
);

export default ProfileInputField;
