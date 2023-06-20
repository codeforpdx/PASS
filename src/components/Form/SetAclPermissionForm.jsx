// React Imports
import React, { useContext, useState } from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
// Utility Imports
import { getPodUrl, runNotification, setDocAclPermission } from '../../utils';
// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Context Imports
import { SelectedUserContext, SignedInUserContext } from '../../contexts';
// Component Imports
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';

/**
 * SetAclPermissionForm Component - Component that generates the form for setting
 * document ACL permissions to another user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name SetAclPermissionForm
 */

const SetAclPermissionForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const { selectedUser } = useContext(SelectedUserContext);
  const [username, setUsername] = useState(selectedUser.username);
  const { podUrl } = useContext(SignedInUserContext);
  const [docType, setDocType] = useState('');

  const handleDocType = (event) => {
    setDocType(event.target.value);
  };

  const clearInputFields = () => {
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  // Event handler for setting ACL permissions to file container on Solid
  const handleAclPermission = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const permissions = event.target.setAclPerms.value
      ? { read: event.target.setAclPerms.value === 'Give' }
      : undefined;
    let podUsername = event.target.setAclTo.value;

    if (!podUsername) {
      podUsername = selectedUser.username;
    }

    if (!podUsername) {
      runNotification('Set permissions failed. Reason: Username not provided.', 5, state, dispatch);
      setTimeout(() => {
        clearInputFields();
      }, 3000);
      return;
    }

    if (getPodUrl(podUsername) === podUrl) {
      runNotification(
        'Set permissions failed. Reason: Current user Pod cannot change container permissions to itself.',
        5,
        state,
        dispatch
      );
      setTimeout(() => {
        clearInputFields();
      }, 3000);
      return;
    }

    if (permissions === undefined) {
      runNotification('Set permissions failed. Reason: Permissions not set.', 5, state, dispatch);
      setTimeout(() => {
        clearInputFields();
      }, 3000);
      return;
    }

    if (!docType) {
      runNotification('Search failed. Reason: No document type selected.', 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
      return;
    }

    try {
      await setDocAclPermission(session, docType, permissions, podUsername);

      runNotification(
        `${permissions.read ? 'Give' : 'Revoke'} permission to ${
          selectedUser.person
        } for ${docType}.`,
        5,
        state,
        dispatch
      );
      setTimeout(() => {
        clearInputFields();
      }, 3000);
    } catch (error) {
      runNotification('Set permissions failed. Reason: File not found.', 5, state, dispatch);
      setTimeout(() => {
        clearInputFields();
      }, 3000);
    }
  };

  return (
    <FormSection
      title="Permission to Files"
      state={state}
      statusType="Permission status"
      defaultMessage="To be set..."
    >
      <Box display="flex" justifyContent="center">
        <form onSubmit={handleAclPermission} autoComplete="off">
          <FormControl fullWidth>
            <InputLabel htmlFor="set-acl-to" label="Set permissions to:" />
            <TextField
              id="set-acl-to"
              name="setAclTo"
              value={selectedUser.person ? selectedUser.username : username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={selectedUser.username}
              label="Search Username"
              required
            />
          </FormControl>
          <DocumentSelection
            htmlForAndIdProp="set-acl-doctype"
            handleDocType={handleDocType}
            docType={docType}
          />
          <br />
          <FormControl fullWidth>
            <FormLabel htmlFor="set-acl-perm-label">Select permission setting:</FormLabel>
            <RadioGroup row aria-labelledby="set-acl-perm-label" name="set-acl-perm">
              <FormControlLabel
                value="Give"
                control={<Radio />}
                label="Give"
                id="set-acl-perm-give"
                name="setAclPerms"
              />
              <FormControlLabel
                value="Revoke"
                control={<Radio />}
                label="Revoke"
                id="set-acl-perm-revoke"
                name="setAclPerms"
              />
            </RadioGroup>
            <Button variant="contained" disabled={state.processing} type="submit" color="primary">
              Set Permission
            </Button>
          </FormControl>
        </form>
      </Box>
    </FormSection>
  );
};

export default SetAclPermissionForm;
