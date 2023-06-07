// React Imports
import React, { useContext } from 'react';
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
import Typography from '@mui/material/Typography';
// Utility Imports
import { SOLID_IDENTITY_PROVIDER, runNotification, setDocAclPermission } from '../../utils';
// Custom Hook Imports
import { useField, useStatusNotification } from '../../hooks';
// Context Imports
import { SelectUserContext } from '../../contexts';
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
  const { clearValue: clearUsername, ...username } = useField('text');
  const { selectedUser, setSelectedUser } = useContext(SelectUserContext);

  const clearInputFields = () => {
    clearUsername();
    setSelectedUser('');
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  // Event handler for setting ACL permissions to file container on Solid
  const handleAclPermission = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const docType = event.target.document.value;
    const permissions = event.target.setAclPerms.value
      ? { read: event.target.setAclPerms.value === 'Give' }
      : undefined;
    let podUsername = event.target.setAclTo.value;

    if (!podUsername) {
      podUsername = selectedUser;
    }

    if (!podUsername) {
      runNotification('Set permissions failed. Reason: Username not provided.', 5, state, dispatch);
      setTimeout(() => {
        clearInputFields();
      }, 3000);
      return;
    }

    if (
      `https://${podUsername}.${SOLID_IDENTITY_PROVIDER.split('/')[2]}/` ===
      String(session.info.webId.split('profile')[0])
    ) {
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

    try {
      await setDocAclPermission(session, docType, permissions, podUsername);

      runNotification(
        `${permissions.read ? 'Give' : 'Revoke'} permission to ${podUsername} for ${docType}.`,
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

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <FormSection
      title="Permission to Files"
      state={state}
      statusType="Permission status"
      defaultMessage="To be set..."
    >
      <Box display="flex" justifyContent="center">
        <form onSubmit={handleAclPermission} autoComplete="off">
          <FormControl>
            <Typography htmlFor="set-acl-to">Set permissions to username:</Typography>
            <TextField
              id="set-acl-to"
              name="setAclTo"
              {...username}
              placeholder={selectedUser}
              label="Search username"
              required
            />
          </FormControl>
          <InputLabel htmlFor="set-acl-doctype">
            <em>Select Document Type</em>
          </InputLabel>
          <FormControl fullWidth>
            <DocumentSelection htmlId="set-acl-doctype" />
          </FormControl>
          <br />
          <FormControl fullWidth>
            <FormLabel htmlFor="set-acl-perm-label">Select permission setting:</FormLabel>
            <RadioGroup
              row
              aria-labelledby="set-acl-perm-label"
              name="set-acl-perm"
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
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
  /* eslint-enable jsx-a11y/label-has-associated-control */
};

export default SetAclPermissionForm;
