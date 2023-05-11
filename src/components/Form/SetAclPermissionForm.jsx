import React, { useContext } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
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
    const permissionType = event.target.setAclPerms.value;
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

  const formRowStyle = {
    margin: '20px 0'
  };

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <FormSection
      title="Permission to Files"
      state={state}
      statusType="Permission status"
      defaultMessage="To be set..."
    >
      <form onSubmit={handleAclPermission} autoComplete="off">
        <div style={formRowStyle}>
          <label htmlFor="set-acl-to">Set permissions to username: </label>
          <br />
          <br />
          <input
            id="set-acl-to"
            size="60"
            name="setAclTo"
            {...username}
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
  );
  /* eslint-enable jsx-a11y/label-has-associated-control */
};

export default SetAclPermissionForm;
