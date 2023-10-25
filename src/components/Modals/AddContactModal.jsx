// React Imports
import React, { useState } from 'react';
// Material UI Imports
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
// Custom Hook Imports
import useNotification from '@hooks/useNotification';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuList';
import { RELATIONSHIPS, RELATIONSHIP_STATUS } from '@constants';
// Component Imports
import { FormSection } from '../Form';

/**
 * @memberof Contcts
 * @name renderWebId
 * @param {string} username - username to convert into a webId
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
 * @memberof Contacts
 * @name AddContactModal
 * @param {object} props - react props
 * @param {Function} props.addContact  - function to add a contact
 * @param {boolean} props.showAddContactModal - whether to display modal or not
 * @param {Function} props.setShowAddContactModal - toggle modal
 * @returns {React.JSX.Element} - The Add Contact Modal
 */
const AddContactModal = ({ addContact, showAddContactModal, setShowAddContactModal }) => {
  const { addNotification } = useNotification();
  const [userGivenName, setUserGivenName] = useState('');
  const [userFamilyName, setUserFamilyName] = useState('');
  const [username, setUsername] = useState('');
  const [webId, setWebId] = useState('');
  const [pod, setPod] = useState('');
  const [relationship, setRelationship] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [processing, setProcessing] = useState(false);


  const wrappedSetUsername = (value) => {
    setUsername(value);
    const renderedWebId = renderWebId(value);
    setWebId(renderedWebId);
  };

  const handleAddContact = async (event) => {
    event.preventDefault();
    setProcessing(true);
    const userObject = {
      givenName: event.target.addUserGivenName.value,
      familyName: event.target.addUserFamilyName.value,
      webId: event.target.addWebId.value,
      pod: event.target.pod.value,
      relationship: event.target.relationship.value,
      relationshipStatus: event.target.relationshipStatus.value
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
      <FormSection title="Add Contact">
        <form onSubmit={handleAddContact} autoComplete="off">
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
            id="add-user-last-name"
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
            label="username"
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
          <TextField
            margin="normal"
            id="pod"
            name="addPod"
            label="Pod URL"
            autoComplete="pod"
            value={pod}
            onChange={(e) => setPod(e.target.value)}
            fullWidth
          />
          <InputLabel id="relationship-label">Relationship</InputLabel>
          <Select
            labelId="relationship-label"
            id="relationship"
            name="relationship"
            value={relationship}
            label="Relationship"
            onChange={(e) => setRelationship(e.target.value)}
            fullWidth
          >
            <MenuItem value={RELATIONSHIPS.Blank}></MenuItem>
            <MenuItem value={RELATIONSHIPS.Client}>Client</MenuItem>
            <MenuItem value={RELATIONSHIPS.CaseManagement}>Case Management</MenuItem>
            <MenuItem value={RELATIONSHIPS.AssociatedOrg}>Associated Organization</MenuItem>
          </Select>
          <InputLabel id="relationship-status-label">Relationship Status</InputLabel>
          <Select
            labelId="relationship-status-label"
            id="relationshipStatus"
            name="relationshipStatus"
            value={relationshipStatus}
            label="RelationshipStatus"
            onChange={(e) => setRelationshipStatus(e.target.value)}
            fullWidth
          >
            <MenuItem value={RELATIONSHIP_STATUS.ACTIVE}>Active</MenuItem>
            <MenuItem value={RELATIONSHIP_STATUS.ARCHIVED}>Archived</MenuItem>
            <MenuItem value={RELATIONSHIP_STATUS.ETC}>etc</MenuItem>
          </Select>
          <DialogActions>
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
          </DialogActions>
        </form>
      </FormSection>
    </Dialog>
  );
};

export default AddContactModal;
