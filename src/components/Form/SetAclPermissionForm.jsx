import React, { useContext } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useSession } from '@inrupt/solid-ui-react';
import { runNotification, setDocAclPermission } from '../../utils';
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
  const { clearValue: clearUrl, ...user } = useField('text');
  const { selectedUser, setSelectedUser } = useContext(SelectUserContext);

  const clearInputFields = () => {
    clearUrl();
    setSelectedUser('');
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  // Event handler for setting ACL permissions to file container on Solid
  const handleAclPermission = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const docType = event.target.document.value;
    const permissionType = event.target.setAclPerms.value;
    let podUrl = event.target.setAclTo.value;

    if (!podUrl) {
      podUrl = selectedUser;
    }

    if (!podUrl) {
      runNotification('Set permissions failed. Reason: Pod URL not provided.', 5, state, dispatch);
      setTimeout(() => {
        clearInputFields();
      }, 3000);
      return;
    }

    if (`https://${podUrl}/` === String(session.info.webId.split('profile')[0])) {
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
      await setDocAclPermission(session, docType, permissionType, podUrl);

      runNotification(
        `${permissionType} permission to ${podUrl} for ${docType}.`,
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

  const formRowStyle = {
    margin: '20px 0'
  };

  return (
    <Container component="main" maxWidth="">
      <Box
        sx={{
          margin: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '5px',
          width: '95vw'
        }}
      >
        <Paper elevation={2} sx={{ display: 'inline-block', mx: '2px', padding: '20px' }}>
          <FormSection
            title="Permission to Files"
            state={state}
            statusType="Permission status"
            defaultMessage="To be set..."
          >
            <form onSubmit={handleAclPermission} autoComplete="off">
              <div style={formRowStyle}>
                <label htmlFor="set-acl-to">
                  Set permissions to (i.e., username.opencommons.net):{' '}
                </label>
                <br />
                <br />
                <input
                  id="set-acl-to"
                  size="60"
                  name="setAclTo"
                  {...user}
                  placeholder={selectedUser}
                />
              </div>
              <div style={formRowStyle}>
                <label htmlFor="set-acl-doctype">Select document type: </label>
                <DocumentSelection htmlId="set-acl-doctype" />{' '}
              </div>
              <div style={formRowStyle}>
                <p>Select permission setting:</p>
                <input type="radio" id="set-acl-perm-give" name="setAclPerms" value="Give" />
                <label htmlFor="set-acl-perm-give">Give</label>
                <input type="radio" id="set-acl-perm-revoke" name="setAclPerms" value="Revoke" />
                <label htmlFor="set-acl-perm-revoke">Revoke</label>
              </div>
              <button disabled={state.processing} type="submit">
                Set Permission
              </button>
            </form>
          </FormSection>
        </Paper>
      </Box>
    </Container>
  );
};

export default SetAclPermissionForm;
