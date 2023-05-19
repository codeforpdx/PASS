// React Imports
import React, { useContext, useState } from 'react';
// Solid Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
// Custom Component Imports
import { SOLID_IDENTITY_PROVIDER, runNotification, setDocAclPermission } from '../../utils';
import { useField, useStatusNotification } from '../../hooks';
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';
import { SelectUserContext } from '../../contexts';

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
  const [documentType, setdocumentType] = useState('');
  const [searchUser, setSearchUser] = useState('');

  const handleChange = (event) => {
    setdocumentType(event.target.value);
  };
  const clearInputFields = () => {
    clearUsername();
    setSelectedUser('');
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  // Event handler for setting ACL permissions to file container on Solid
  const handleAclPermission = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const docType = documentType;
    const permissionType = event.target.setAclPerms.value;
    let podUsername = searchUser;

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

    if (!permissionType) {
      runNotification('Set permissions failed. Reason: Permissions not set.', 5, state, dispatch);
      setTimeout(() => {
        clearInputFields();
      }, 3000);
      return;
    }

    try {
      await setDocAclPermission(session, docType, permissionType, podUsername);

      runNotification(
        `${permissionType} permission to ${podUsername} for ${docType}.`,
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
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth autoComplete="off">
          <TextField
            {...username}
            label="Search document from username"
            InputProps={{
              type: 'search'
            }}
            id="set-acl-to"
            fullWidth
            name="setAclTo"
            placeholder={selectedUser}
            value={searchUser}
            onChange={(event) => {
              setSearchUser(event.target.value);
            }}
          />
          <br />
          <br />
          <InputLabel id="set-acl-doctype">
            <i>Select Document Type</i>
          </InputLabel>
          <DocumentSelection
            htmlId="set-acl-doctype"
            value={documentType}
            onChange={handleChange}
          />
          {/* <div style={formRowStyle}>
          <p>Select permission setting:</p>
          <input type="radio" id="set-acl-perm-give" name="setAclPerms" value="Give" />
          <label htmlFor="set-acl-perm-give">Give</label>
          <input type="radio" id="set-acl-perm-revoke" name="setAclPerms" value="Revoke" />
          <label htmlFor="set-acl-perm-revoke">Revoke</label>
        </div> */}
          <br />
          <br />
          <FormLabel id="set-acl-permission">Select permission setting:</FormLabel>
          <RadioGroup row aria-labelledby="set-acl-permission" name="row-radio-buttons-group">
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
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          disabled={state.processing}
          type="submit"
          onClick={handleAclPermission}
        >
          Set Permission
        </Button>
      </Box>
    </FormSection>
  );
  /* eslint-enable jsx-a11y/label-has-associated-control */
};

export default SetAclPermissionForm;
