// React Imports
import React, { useState } from 'react';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
// Utility Imports
import { fetchProfileInfo, updateProfileInfo } from '../../model-helpers';

/**
 * messageFolderProps is an object that stores the props for the MessageFolder
 * component
 *
 * @typedef profileInputFieldProps
 * @type {object}
 * @property {string} inputName - Name of input field
 * @property {string} inputValue - Value of input field used for updating profile
 * @property {(value: React.SetStateAction<null>) => void} setInputValue - Set
 * function for inputValue
 * @property {() => void} fetchProfileData - Handler function for fetching data
 * from user's profile card
 * @memberof typedefs
 */

/**
 * ProfileInputField Component - Component that creates the editable inputs fields
 * for the Profile page
 *
 * @memberof Inbox
 * @name ProfileInputField
 * @param {profileInputFieldProps} Props - Props used for NewMessage
 * @returns {React.JSX.Element} React component for NewMessage
 */
const ProfileInputField = ({ inputName, inputValue, setInputValue, fetchProfileData }) => {
  const { session } = useSession();
  const [edit, setEdit] = useState(false);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    const profileData = await fetchProfileInfo(session);
    const inputField = inputName === 'Name' ? 'profileName' : inputName.toLowerCase();

    await updateProfileInfo(session, profileData, inputField, inputValue);

    fetchProfileData();
    setEdit(false);
  };

  const handleCancelEdit = () => {
    fetchProfileData();

    setEdit(!edit);
  };

  const handleEditInput = () => {
    setEdit(!edit);
  };

  return (
    <form onSubmit={handleUpdateProfile}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <InputLabel htmlFor={`input-${inputName}`} sx={{ color: 'black' }}>
            {inputName}:{' '}
          </InputLabel>
          <Input
            id={`input-${inputName}`}
            value={inputValue === null ? 'No value set' : inputValue}
            disabled={!edit}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button
            variant="outlined"
            type="button"
            color={edit ? 'error' : 'primary'}
            endIcon={edit ? <ClearIcon /> : <EditIcon />}
            onClick={edit ? handleCancelEdit : handleEditInput}
          >
            {edit ? 'Cancel' : 'Edit'}
          </Button>
        </Box>
        {edit && (
          <Button variant="outlined" type="submit" endIcon={<CheckIcon />}>
            Update
          </Button>
        )}
      </Box>
    </form>
  );
};

export default ProfileInputField;
