import React, { useContext } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { SOLID_IDENTITY_PROVIDER, checkContainerPermission, runNotification } from '../../utils';
import { useField, useStatusNotification } from '../../hooks';
import FormSection from './FormSection';
import { SelectUserContext } from '../../contexts';

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
    let podUsername = event.target.setAclTo.value;

    if (!podUsername) {
      podUsername = selectedUser;
    }

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

    if (
      `https://${podUsername}.${SOLID_IDENTITY_PROVIDER.split('/')[2]}/` ===
      String(session.info.webId.split('profile')[0])
    ) {
      runNotification(
        'Check permissions failed. Reason: User already have access to their own Documents container.',
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

  const formRowStyle = {
    margin: '20px 0'
  };

  return (
    <FormSection
      title="Check Permission to Documents Container"
      state={state}
      statusType="Permission status"
      defaultMessage="To be set..."
    >
      <form onSubmit={handleAclPermission} autoComplete="off">
        <div style={formRowStyle}>
          <label htmlFor="set-acl-to">
            Check permissions to username&apos;s Documents container:{' '}
          </label>
          <br />
          <br />
          <input id="set-acl-to" size="60" name="setAclTo" {...user} placeholder={selectedUser} />
        </div>
        <button disabled={state.processing} type="submit">
          Check Permission
        </button>
      </form>
    </FormSection>
  );
};

export default CheckAclPermsDocContainerForm;
