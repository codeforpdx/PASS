// React Imports
import React, { useContext, useState } from 'react';
// Custom Hook Imports
import { useSession, useStatusNotification } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import Dialog from '@mui/material/Dialog';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import SettingsIcon from '@mui/icons-material/Settings';
import TextField from '@mui/material/TextField';
// Utility Imports
import { runNotification, setDocContainerAclPermission } from '@utils';
// Context Imports
import { SignedInUserContext } from '@contexts';
// Component Imports
import FormSection from '../Form/FormSection';

/**
 * @typedef {import("../../typedefs.js").setAclPermsDocContainerModalProps} setAclPermsDocContainerModalProps
 */

/**
 * SetAclPermsDocContainerModal Component - Modal component that generates the form for
 * setting ACL permissions to another user's Documents container in their Solid
 * Pod via Solid Session
 *
 * @memberof Forms
 * @name SetAclPermsDocContainerModal
 * @param {setAclPermsDocContainerModalProps} Props - Props for SetAclPermsDocContainerModal component
 * @returns {React.JSX.Element} The SetAclPermsDocContainerModal Component
 */
const SetAclPermsDocContainerModal = ({ showModal, setShowModal }) => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const { podUrl } = useContext(SignedInUserContext);
  const [permissionState, setPermissionState] = useState({
    podUrlToSetPermissionsTo: '',
    permissionType: ''
  });

  const clearInputFields = () => {
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  const handleCloseModal = () => {
    setPermissionState({
      podUrlToSetPermissionsTo: '',
      permissionType: ''
    });
    setShowModal(false);
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
    const webIdToSetPermsTo = `${permissionState.podUrlToSetPermissionsTo}profile/card#me`;

    try {
      await setDocContainerAclPermission(session, permissions, podUrl, webIdToSetPermsTo);

      runNotification(
        `${permissions.read ? 'Give' : 'Revoke'} permission to ${
          permissionState.podUrlToSetPermissionsTo
        } for Documents Container.`,
        5,
        state,
        dispatch
      );
    } catch (error) {
      runNotification('Failed to set permissions. Reason: File not found.', 5, state, dispatch);
    } finally {
      setTimeout(() => {
        clearInputFields();
      }, 3000);
    }
  };

  return (
    <Dialog open={showModal} onClose={handleCloseModal}>
      <FormSection
        title="Permission for Container"
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
            <br />
            <FormControl fullWidth sx={{ marginBottom: '2rem' }}>
              <TextField
                id="set-acl-to"
                name="setAclTo"
                value={permissionState.podUrlToSetPermissionsTo}
                onChange={(e) =>
                  setPermissionState({
                    ...permissionState,
                    podUrlToSetPermissionsTo: e.target.value
                  })
                }
                placeholder={permissionState.podUrlToSetPermissionsTo}
                label="Enter podURL"
                required
                error={permissionState.podUrlToSetPermissionsTo === podUrl}
                helperText={
                  permissionState.podUrlToSetPermissionsTo === podUrl
                    ? 'Cannot modify your permissions to your own pod.'.toUpperCase()
                    : ''
                }
              />
            </FormControl>
            <br />
            <FormControl fullWidth sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
              <Button
                variant="contained"
                disabled={permissionState.podUrlToSetPermissionsTo === podUrl || state.processing}
                type="submit"
                color="primary"
                startIcon={<SettingsIcon />}
                fullWidth
                sx={{ borderRadius: '20px' }}
              >
                {permissionState.permissionType
                  ? `${permissionState.permissionType} Permission`
                  : 'Set Permission'}
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<ClearIcon />}
                onClick={handleCloseModal}
                fullWidth
                sx={{ borderRadius: '20px' }}
              >
                CANCEL
              </Button>
            </FormControl>
          </form>
        </Box>
      </FormSection>
    </Dialog>
  );
};

export default SetAclPermsDocContainerModal;
