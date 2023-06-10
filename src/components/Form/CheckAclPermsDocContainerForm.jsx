// React Imports
import React, { useContext } from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
// Utility Imports
import { checkContainerPermission, runNotification, getPodUrl } from '../../utils';
// Custom Hook Imports
import { useField, useStatusNotification } from '../../hooks';
// Context Imports
import { SelectUserContext, SignedInUserContext } from '../../contexts';
// Component Imports
import FormSection from './FormSection';

/**
 * CheckAclPermsDocContainerForm Component - Component that generates the form
 * for checking if ACL permissions to another user's Documents container are
 * available
 *
 * @memberof Forms
 * @name CheckAclPermsDocContainerForm
 */

const CheckAclPermsDocContainerForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const { clearValue: clearUrl, ...user } = useField('text');
  const { selectedUser } = useContext(SelectUserContext);
  const { podUrl } = useContext(SignedInUserContext);

  const clearInputFields = () => {
    clearUrl();
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  // Event handler for setting ACL permissions to file container on Solid
  const handleAclPermission = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    let podUsername = event.target.setAclTo.value;

    if (!podUsername) {
      podUsername = selectedUser.username;
    }

    // TODO: Determine if this is necessary as MUI provides its own verification
    if (!podUsername) {
      runNotification(
        'Check permissions failed. Reason: Username not provided.',
        5,
        state,
        dispatch
      );
      setTimeout(() => {
        clearInputFields();
      }, 3000);
      return;
    }

    if (getPodUrl(podUsername) === podUrl) {
      runNotification(
        'Check permissions failed. Reason: User already has access to their own Documents container.',
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
      const containerUrl = await checkContainerPermission(session, podUsername);

      if (state.documentUrl) {
        dispatch({ type: 'CLEAR_DOCUMENT_LOCATION' });
      }

      setTimeout(() => {
        dispatch({ type: 'SET_DOCUMENT_LOCATION', payload: containerUrl });
        runNotification('Permission allowed. Document container: ', 5, state, dispatch);
      }, 3000);
      setTimeout(() => {
        clearInputFields();
      }, 3000);
    } catch (error) {
      runNotification('Permission not allowed. Reason: Permission not set.', 5, state, dispatch);
      setTimeout(() => {
        clearInputFields();
      }, 3000);
    }
  };

  return (
    <FormSection
      title="Check Permission to Documents Container"
      state={state}
      statusType="Permission status"
      defaultMessage="To be set..."
    >
      <Box display="flex" justifyContent="center">
        <form onSubmit={handleAclPermission} autoComplete="off">
          <FormControl>
            <TextField
              id="set-acl-to"
              name="setAclTo"
              {...user}
              placeholder={selectedUser.username}
              label="Search username"
              required
            />
            <br />
            <Button variant="contained" disabled={state.processing} type="submit" color="primary">
              Check Permission
            </Button>
          </FormControl>
        </form>
      </Box>
    </FormSection>
  );
};

export default CheckAclPermsDocContainerForm;
