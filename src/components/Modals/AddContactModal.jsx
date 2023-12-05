// React Imports
import React, { useState } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Custom Hook Imports
import useNotification from '@hooks/useNotification';
// Component Imports
import { FormSection } from '../Form';

/**
 * @memberof Modals
 * @name renderWebId
 * @param {string} username - Username to convert into a webId
 * @returns {URL} A url of the predicted webID
 */
const renderWebId = (username) => {
  const baseUrl = new URL(localStorage.getItem('oidcIssuer'));
  return new URL(`${username}/profile/card#me`, baseUrl);
};

/**
 * AddContactModal Component - Component that allows users to add other user's
 * Pod URLs from a user's list stored on their own Pod
 *
 * @memberof Modals
 * @name AddContactModal
 * @param {object} props - React props
 * @param {Function} props.addContact - Function to add a contact
 * @param {boolean} props.showAddContactModal - Whether to display modal or not
 * @param {Function} props.setShowAddContactModal - Toggle modal
 * @returns {React.JSX.Element} - The Add Contact Modal
 */
const AddContactModal = ({ addContact, showAddContactModal, setShowAddContactModal }) => {
  const { addNotification } = useNotification();
  const [userGivenName, setUserGivenName] = useState('');
  const [userFamilyName, setUserFamilyName] = useState('');
  const [username, setUsername] = useState('');
  const [webId, setWebId] = useState('');
  const [processing, setProcessing] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const wrappedSetUsername = (value) => {
    setUsername(value);
    const renderedWebId = renderWebId(value);
    setWebId(renderedWebId);
  };

  const handleAddContact = async (event) => {
    event.preventDefault();
    setProcessing(true);
    const { addUserGivenName, addUserFamilyName, addWebId } = event.target.elements;
    const userObject = {
      givenName: addUserGivenName.value.trim(),
      familyName: addUserFamilyName.value.trim(),
      webId: addWebId.value.trim()
    };

    try {
      await addContact(userObject);
      addNotification(
        'success',
        `"${userObject.givenName} ${userObject.familyName}" added to contact list`
      );
    } catch (e) {
      addNotification('error', `Add contact failed. Reason: ${e.message}`);
    } finally {
      setUserGivenName('');
      setUserFamilyName('');
      setUsername('');
      setWebId('');
      setShowAddContactModal(false);
      setProcessing(false);
    }
  };

  return (
    <Dialog
      open={showAddContactModal}
      aria-labelledby="dialog-title"
      onClose={() => setShowAddContactModal(false)}
    >
      <FormSection title="Add Contact" headingId="add-contact-form">
        <form aria-labelledby="add-contact-form" onSubmit={handleAddContact} autoComplete="off">
          <FormControl fullWidth>
            <TextField
              margin="normal"
              id="add-user-given-name"
              name="addUserGivenName"
              label="First/given name"
              autoComplete="given-name"
              value={userGivenName}
              onChange={(e) => setUserGivenName(e.target.value)}
              required
              fullWidth
              autoFocus
            />
          </FormControl>
          <TextField
            margin="normal"
            id="add-user-family-name"
            name="addUserFamilyName"
            label="Last/family name"
            autoComplete="family-name"
            value={userFamilyName}
            onChange={(e) => setUserFamilyName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            margin="normal"
            id="add-username"
            name="addUsername"
            label="Username"
            autoComplete="username"
            value={username}
            onChange={(e) => wrappedSetUsername(e.target.value)}
            required
            fullWidth
          />
          <TextField
            margin="normal"
            id="add-webId"
            name="addWebId"
            placeholder="WebId"
            autoComplete="webid"
            value={webId}
            type="text"
            onChange={(e) => {
              setWebId(e.target.value);
            }}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="Copy WebId" edge="end">
                    <ContentCopyIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <DialogActions sx={{ width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: isSmallScreen ? 'column' : 'row',
                gap: isSmallScreen ? '10px' : '8px',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <Button
                variant="outlined"
                color="error"
                endIcon={<ClearIcon />}
                onClick={() => setShowAddContactModal(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disabled={processing}
                color="primary"
                endIcon={<CheckIcon />}
                type="submit"
                fullWidth
              >
                Add Contact
              </Button>
            </Box>
          </DialogActions>
        </form>
      </FormSection>
    </Dialog>
  );
};

export default AddContactModal;
