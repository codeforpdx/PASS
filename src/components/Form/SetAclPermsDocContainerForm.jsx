// React Imports
import React, { useContext, useState } from 'react';
// Custom Hook Imports
import { useSession, useStatusNotification } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// Utility Imports
import { getPodUrl, runNotification, setDocContainerAclPermission } from '@utils';
// Context Imports
import { SignedInUserContext } from '@contexts';
// Component Imports
import FormSection from './FormSection';

/**
 * @typedef {import("../../typedefs.js").setAclPermsDocContainerFormProps} setAclPermsDocContainerFormProps
 */

/**
 * SetAclPermsDocContainerForm Component - Component that generates the form for
 * setting ACL permissions to another user's Documents container in their Solid
 * Pod via Solid Session
 *
 * @memberof Forms
 * @name SetAclPermsDocContainerForm
 * @param {setAclPermsDocContainerFormProps} Props - Props for component
 * @returns {React.JSX.Element} The SetAclPermsDocContainerForm Component
 */
const SetAclPermsDocContainerForm = ({ client }) => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const [username, setUsername] = useState('');
  const { podUrl } = useContext(SignedInUserContext);

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
    let otherPodUsername = event.target.setAclTo.value;

    if (!otherPodUsername) {
      otherPodUsername = client?.username;
    }

    if (!otherPodUsername) {
      runNotification('Set permissions failed. Reason: Username not provided.', 5, state, dispatch);
      setTimeout(() => {
        clearInputFields();
      }, 3000);
      return;
    }

    if (getPodUrl(otherPodUsername) === podUrl) {
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

    // Routine for setting permissions to Documents
    if (!client) {
      try {
        await setDocContainerAclPermission(session, permissions, podUrl, otherPodUsername);

        runNotification(
          `${permissions.read ? 'Give' : 'Revoke'} permission to ${
            client?.person ?? username
          } for Documents Container.`,
          5,
          state,
          dispatch
        );
      } catch (error) {
        runNotification('Set permissions failed. Reason: File not found.', 5, state, dispatch);
      } finally {
        setTimeout(() => {
          clearInputFields();
        }, 3000);
      }
    } else {
      // Routine for requesting permissions to Documents
      // TODO: Create request permissions function for Documents
      setTimeout(() => {
        clearInputFields();
      }, 3000);
    }
  };

  return (
    <FormSection
      title={`${client ? 'Request' : 'Set'} Permission to Documents`}
      state={state}
      statusType="Permission status"
      defaultMessage="To be set..."
    >
      <Box display="flex" justifyContent="center">
        <form onSubmit={handleAclPermission} autoComplete="off">
          <FormControl>
            <Typography htmlFor="set-acl-to">
              {client ? 'Request' : 'Set'} permissions to username:
            </Typography>
            <TextField
              id="set-acl-to"
              name="setAclTo"
              value={client ? client?.username : username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={client ? client?.username : username}
              label="Search Username"
              required
            />
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
              {client ? 'Request' : 'Set'} Permission
            </Button>
          </FormControl>
        </form>
      </Box>
    </FormSection>
  );
};

export default SetAclPermsDocContainerForm;
