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
import ShieldIcon from '@mui/icons-material/Shield';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// Utility Imports
import { runNotification, setDocAclPermission, setDocContainerAclPermission } from '@utils';
// Context Imports
import { SignedInUserContext } from '@contexts';
// Component Imports
import { DocumentSelection, FormSection } from '../Form';

/**
 * @typedef {import("../../typedefs.js").setAclPermissionsModalProps} setAclPermissionsModalProps
 */

/**
 * SetPermissionsModal Component - Modal component that generates the form for
 * setting ACL permissions to another user's documents, or document container
 * in their Solid Pod via Solid Session.
 *
 * @memberof Modals
 * @name SetAclPermissionsModal
 * @param {setAclPermissionsModalProps} Props - Props for SetAclPermsDocContainerModal component
 * @returns {React.JSX.Element} The SetAclPermsDocContainerModal Component
 */

const SetAclPermissionsModal = ({ showModal, setShowModal, dataset }) => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const { podUrl } = useContext(SignedInUserContext);
  const [docType, setDocType] = useState('');
  const [permissionState, setPermissionState] = useState({
    podUrlToSetPermissionsTo: '',
    permissionType: ''
  });

  const handleDocType = (event) => {
    setDocType(event.target.value);
  };

  const clearInputFields = () => {
    dispatch({ type: 'CLEAR_PROCESSING' });
    setPermissionState({
      podUrlToSetPermissionsTo: '',
      permissionType: ''
    });
    setDocType('');
    setShowModal(false);
  };

  // Event handler for setting ACL permissions to file or container on Solid
  const handleAclPermission = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const permissions = event.target.setAclPerms.value
      ? {
          read: event.target.setAclPerms.value === 'Give',
          append: event.target.setAclPerms.value === 'Give' && dataset.modalType === 'container'
        }
      : undefined;
    const webIdToSetPermsTo = `${permissionState.podUrlToSetPermissionsTo}profile/card#me`;

    try {
      switch (dataset.modalType) {
        case 'container':
          await setDocContainerAclPermission(session, permissions, podUrl, webIdToSetPermsTo);
          break;
        case 'document':
          await setDocAclPermission(session, docType, permissions, podUrl, webIdToSetPermsTo);
          break;
        default:
          break;
      }

      runNotification(
        `${permissions.read ? 'Give' : 'Revoke'} permission to ${
          permissionState.podUrlToSetPermissionsTo
        } for ${dataset.modalType === 'container' ? 'Documents Container' : docType}.`,
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
    <div>
      <Dialog open={showModal} onClose={clearInputFields}>
        <FormSection
          title={
            dataset.modalType === 'container'
              ? 'Permission for all Documents'
              : 'Permission for Document'
          }
          state={state}
          statusType="Status"
          defaultMessage="No action yet..."
        >
          <Box display="flex" justifyContent="center">
            <form onSubmit={handleAclPermission} autoComplete="off">
              {dataset.modalType === 'document' ? (
                <Typography
                  variant="subtitle2"
                  mb={2}
                  sx={{
                    width: '250px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  <span style={{ color: 'grey' }}>File Name: </span>
                  {dataset.documentName}
                </Typography>
              ) : null}
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
              <FormControl fullWidth sx={{ marginBottom: '1rem' }}>
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

              {dataset.modalType === 'container' ? (
                <DocumentSelection
                  htmlForAndIdProp="set-acl-doctype"
                  handleDocType={handleDocType}
                  docType={docType}
                />
              ) : null}

              <br />
              <FormControl fullWidth sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                <Button
                  variant="contained"
                  disabled={permissionState.podUrlToSetPermissionsTo === podUrl || state.processing}
                  type="submit"
                  color="primary"
                  startIcon={<ShieldIcon />}
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
                  onClick={clearInputFields}
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
    </div>
  );
};

export default SetAclPermissionsModal;
