// React Imports
import React, { useState } from 'react';
// Inrupt Imports
import { getWebIdDataset } from '@inrupt/solid-client';
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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Custom Hook Imports
import useNotification from '@hooks/useNotification';
// Constant Imports
import { ENV } from '@constants';
// Component Imports
import { FormSection } from '../Form';

// @memberof Modals
// @name renderWebId
// @param {string} username - Username to convert into a webId
// @returns {URL} A url of the predicted webID

// const renderWebId = (username) => {
// const baseUrl = new URL(localStorage.getItem('oidcIssuer'));
//  return new URL(`${username}/profile/card#me`, baseUrl);
// };

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
  const [webId, setWebId] = useState('');
  const [invalidWebId, setInvalidWebId] = useState(false);
  const [userName, setUserName] = useState('');
  const [customWebID, setCustomWebID] = useState(false);
  const [processing, setProcessing] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [oidcProviders] = useState([...ENV.VITE_SUGGESTED_OIDC_OPTIONS.split(', '), 'Other']);
  const [Oidc, setOIDC] = useState('');

  const clearInputFields = () => {
    setUserGivenName('');
    setUserFamilyName('');
    setWebId('');
    setInvalidWebId(false);
    setOIDC('');
    setCustomWebID(false);
    setUserName('');
  };

  const handleOidcSelection = (e) => {
    if (e.target.value === 'Other') {
      setCustomWebID(true);
    } else {
      setCustomWebID(false);
    }
    setOIDC(e.target.value);
  };

  const handleAddContact = async (event) => {
    event.preventDefault();
    setProcessing(true);

    const { addUserGivenName, addUserFamilyName, addWebId } = event.target.elements;
    let userObject;

    if (customWebID) {
      userObject = {
        webId: addWebId.value.trim(),
        ...(addUserGivenName.value && { givenName: addUserGivenName.value.trim() }),
        ...(addUserFamilyName.value && { familyName: addUserFamilyName.value.trim() })
      };
    } else {
      userObject = {
        webId: JSON.parse(ENV.VITE_OIDC_WEBIDS)[Oidc].replace('user', userName.trim()).trim(),
        ...(addUserGivenName.value && { givenName: addUserGivenName.value.trim() }),
        ...(addUserFamilyName.value && { familyName: addUserFamilyName.value.trim() })
      };
    }

    try {
      await getWebIdDataset(userObject.webId);
      await addContact(userObject);
      const nameDisplay =
        [userObject.givenName, userObject.familyName].filter(Boolean).join(' ') || userObject.webId;
      addNotification('success', `"${nameDisplay}" added to contact list`);

      setShowAddContactModal(false);
      clearInputFields();
    } catch (e) {
      const errorMessage = e ? e.message : 'Unknown error occurred';
      addNotification('error', `Add contact failed. Reason: ${errorMessage}`);
      setInvalidWebId(true);
    } finally {
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
              label="First/given name (Optional)"
              autoComplete="given-name"
              value={userGivenName}
              onChange={(e) => setUserGivenName(e.target.value)}
              fullWidth
              autoFocus
            />
          </FormControl>
          <TextField
            margin="normal"
            id="add-user-family-name"
            name="addUserFamilyName"
            label="Last/family name (Optional)"
            autoComplete="family-name"
            value={userFamilyName}
            onChange={(e) => setUserFamilyName(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>OIDC Provider</InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              value={Oidc}
              label="OIDC Provider"
              data-testid="select-oidc"
              onChange={handleOidcSelection}
              fullWidth
            >
              {oidcProviders.map((oidc) => (
                <MenuItem key={oidc} value={oidc}>
                  {oidc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {!customWebID && (
            <FormControl fullWidth>
              <TextField
                margin="normal"
                id="add-user-name"
                name="addUserName"
                label="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                fullWidth
                autoFocus
              />
            </FormControl>
          )}
          {customWebID && (
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
              error={invalidWebId}
              label={invalidWebId ? 'Error' : ''}
              // helperText for invalidWebId === false is ' ' and not '' is to
              // prevent the field from stretching when helperText disappears
              helperText={invalidWebId ? 'Invalid WebId.' : ' '}
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
          )}
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
                onClick={() => {
                  clearInputFields();
                  setShowAddContactModal(false);
                }}
                fullWidth
                sx={{ borderRadius: '20px' }}
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
                sx={{ borderRadius: '20px' }}
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
