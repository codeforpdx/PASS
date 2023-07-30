// React Imports
import React, { useContext, useState } from 'react';
// Custom Hook Imports
import { useSession, useStatusNotification } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
// Utility Imports
import { runNotification, setDocAclPermission } from '@utils';
// Context Imports
import { SignedInUserContext } from '@contexts';
// Component Imports
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';

/**
 * SetAclPermissionForm Component - Component that generates the form for setting
 * document ACL permissions to another user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name SetAclPermissionForm
 * @returns {React.JSX.Element} The SetAclPermissionForm Component
 */
const SetAclPermissionForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const { podUrl } = useContext(SignedInUserContext);
  const [docType, setDocType] = useState('');
  const [permissionState, setPermissionState] = useState({
    podToSetPermissionsTo: '',
    permissionType: ''
  });

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
    const podUrlToSetPermissionsTo = event.target.setAclTo.value;

    if (podUrlToSetPermissionsTo === podUrl) {
      runNotification(
        'FAILED TO SET PERMISSIONS. REASON: Current user Pod cannot change container permissions to itself.',
        5,
        state,
        dispatch
      );
      setTimeout(() => {
        clearInputFields();
      }, 3000);
      return;
    }

    try {
      await setDocAclPermission(session, docType, permissions, podUrl, podUrlToSetPermissionsTo);

      runNotification(
        `${permissions.read ? 'Give' : 'Revoke'} permission to ${
          permissionState.podToSetPermissionsTo
        } for ${docType}.`,
        5,
        state,
        dispatch
      );
    } catch (error) {
      runNotification('FAILED TO SET PERMISSIONS. REASON: File not found.', 5, state, dispatch);
    } finally {
      setTimeout(() => {
        clearInputFields();
      }, 3000);
    }
  };

  return (
    <FormSection
      title="Permission for [FileName]"
      state={state}
      statusType="Status"
      defaultMessage="No action yet..."
    >
      <Box display="flex" justifyContent="center">
        <form onSubmit={handleAclPermission} autoComplete="off">
          <FormControl required fullWidth sx={{ marginBottom: '1rem' }}>
            <InputLabel id="permissionType-label">Select One</InputLabel>
            <Select
              labelId="permissionType-label"
              id="permissionType"
              label="Select One"
              value={permissionState.permissionType}
              onChange={(e) =>
                setPermissionState({ ...permissionState, permissionType: e.target.value })
              }
              name="setAclPerms"
            >
              <MenuItem value="Give">Give Permission</MenuItem>
              <MenuItem value="Revoke">Revoke Permission</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ marginBottom: '1rem' }}>
            <TextField
              id="set-acl-to"
              name="setAclTo"
              value={permissionState.podToSetPermissionsTo}
              onChange={(e) =>
                setPermissionState({ ...permissionState, podToSetPermissionsTo: e.target.value })
              }
              placeholder={permissionState.podToSetPermissionsTo}
              label="Enter PodURL"
              required
            />
          </FormControl>

          <DocumentSelection
            htmlForAndIdProp="set-acl-doctype"
            handleDocType={handleDocType}
            docType={docType}
          />

          <FormControl fullWidth sx={{ marginTop: '2rem' }}>
            <Button variant="contained" disabled={state.processing} type="submit" color="primary">
              {permissionState.permissionType
                ? `${permissionState.permissionType} Permission`
                : 'Give or Revoke Permission'}
            </Button>
          </FormControl>
        </form>
      </Box>
    </FormSection>
  );
};

export default SetAclPermissionForm;
