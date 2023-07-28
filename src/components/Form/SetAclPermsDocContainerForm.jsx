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
import { getPodUrl, runNotification, setDocContainerAclPermission } from '@utils';
// Context Imports
import { SignedInUserContext } from '@contexts';
// Component Imports
import FormSection from './FormSection';

/**
 * SetAclPermsDocContainerForm Component - Component that generates the form for
 * setting ACL permissions to another user's Documents container in their Solid
 * Pod via Solid Session
 *
 * @memberof Forms
 * @name SetAclPermsDocContainerForm
 * @returns {React.JSX.Element} The SetAclPermsDocContainerForm Component
 */
const SetAclPermsDocContainerForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const { podUrl } = useContext(SignedInUserContext);
  const [permissionState, setPermissionState] = useState({
    username: '',
    permissionType: ''
  });

  const clearInputFields = () => {
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  // Event handler for setting ACL permissions to file container on Solid
  const handleAclPermission = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const permissions = event.target.setAclPerms.value
      ? {
          read: event.target.setAclPerms.value === 'Give',
          append: event.target.setAclPerms.value === 'Give'
        }
      : undefined;
    const otherPodUsername = event.target.setAclTo.value;

    if (!otherPodUsername) {
      runNotification(
        'FAILED TO SET PERMISSIONS. REASON: PodURL not provided.',
        5,
        state,
        dispatch
      );
      setTimeout(() => {
        clearInputFields();
      }, 3000);
      return;
    }

    if (getPodUrl(otherPodUsername) === podUrl) {
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

    // if (permissions === undefined) {
    //   runNotification('FAILED TO SET PERMISSIONS. REASON: Permissions not set.', 5, state, dispatch);
    //   setTimeout(() => {
    //     clearInputFields();
    //   }, 3000);
    //   return;
    // }

    try {
      await setDocContainerAclPermission(session, permissions, podUrl, otherPodUsername);

      runNotification(
        `${permissions.read ? 'Give' : 'Revoke'} permission to ${
          permissionState.username
        } for Documents Container.`,
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
      title="Permission for all Documents"
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

          <FormControl fullWidth sx={{ marginBottom: '2rem' }}>
            <TextField
              id="set-acl-to"
              name="setAclTo"
              value={permissionState.username}
              onChange={(e) => setPermissionState({ ...permissionState, username: e.target.value })}
              placeholder={permissionState.username}
              label="Enter PodURL"
              required
            />
          </FormControl>

          <FormControl fullWidth>
            <Button
              variant="contained"
              disabled={
                state.processing ||
                permissionState.username === '' ||
                permissionState.permissionType === ''
              }
              type="submit"
              color="primary"
            >
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

export default SetAclPermsDocContainerForm;
