import React from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { runNotification, setDocAclPermission } from '../../utils';
import { useStatusNotification } from '../../hooks';
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

  // Event handler for setting ACL permissions to file container on Solid
  const handleAclPermission = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const docType = event.target.document.value;
    const podUrl = event.target.setAclTo.value;
    const permissionType = event.target.setAclPerms.value;

    if (!podUrl) {
      runNotification('Set permissions failed. Reason: Pod URL not provided.', 3, state, dispatch);
      return;
    }

    if (`https://${podUrl}/` === String(session.info.webId.split('profile')[0])) {
      runNotification(
        'Set permissions failed. Reason: Current user Pod cannot change container permissions to itself.',
        3,
        state,
        dispatch
      );
      return;
    }

    if (!permissionType) {
      runNotification('Set permissions failed. Reason: Permissions not set.', 3, state, dispatch);
      return;
    }

    try {
      await setDocAclPermission(session, docType, permissionType, podUrl);

      runNotification(
        `${permissionType} permission to ${podUrl} for ${docType}.`,
        7,
        state,
        dispatch
      );
    } catch (error) {
      runNotification('Set permissions failed. Reason: File not found.', 3, state, dispatch);
    }
  };

  const formRowStyle = {
    margin: '20px 0'
  };

  return (
    <FormSection
      title="Permission to Files"
      state={state}
      statusType="Permission status"
      defaultMessage="To be set..."
    >
      <form onSubmit={handleAclPermission} autoComplete="off">
        <div style={formRowStyle}>
          <label htmlFor="set-acl-to">
            Paste other user's pod url (i.e., username.opencommons.net):{' '}
          </label>
          <br />
          <br />
          <input id="set-acl-to" size="60" type="text" name="setAclTo" />
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
};

export default SetAclPermissionForm;
