// React Imports
import React, { useContext } from 'react';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Utility Imports
import {
  runNotification,
  addUserToPod,
  getUserListActivity,
  SOLID_IDENTITY_PROVIDER
} from '../../utils';
// Custom Hook Imports
import { useStatusNotification, useField } from '../../hooks';
// Context Imports
import { UserListContext } from '../../contexts';
// Component Imports
import FormSection from '../Form/FormSection';


/**
 * AddClient Component - Component that allows users to add other user's
 * Pod URLs from a user's list stored on their own Pod
 *
 * @memberof Forms
 * @name AddClient
 */

const AddClient = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const { clearValue: clearUserGivenName, ...userGivenName } = useField('text');
  const { clearValue: clearUserFamilyName, ...userFamilyName } = useField('text');
  const { clearValue: clearUsername, ...username } = useField('text');
  const { setUserList } = useContext(UserListContext);

  // Event handler for adding user from users list
  const handleAddClient = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const userObject = {
      givenName: event.target.addUserGivenName.value,
      familyName: event.target.addUserFamilyName.value,
      username: event.target.addUsername.value
    };

    // ===== START OF ERROR DISPLAY OPTIONS =====
    if (!userObject.username) {
      runNotification(`Operation failed. Reason: No username provided`, 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
      return;
    }

    if (!userObject.givenName) {
      runNotification(
        `Operation failed. Reason: User's first/given name is not provided`,
        5,
        state,
        dispatch
      );
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
      return;
    }

    if (!userObject.familyName) {
      runNotification(
        `Operation failed. Reason: User's last/family name is not provided`,
        5,
        state,
        dispatch
      );
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
      return;
    }
    // ===== END OF ERROR DISPLAY OPTIONS =====

    let listUsers = await addUserToPod(session, userObject);
    listUsers = await getUserListActivity(session, listUsers);
    setUserList(listUsers);

    runNotification(
      `Adding user "${userObject.givenName} ${userObject.familyName}" to client list...`,
      5,
      state,
      dispatch
    );

    setTimeout(() => {
      clearUserGivenName();
      clearUserFamilyName();
      clearUsername();
      dispatch({ type: 'CLEAR_PROCESSING' });
    }, 3000);
  };


  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <FormSection
      title="Add Client"
      state={state}
      statusType="Status"
      defaultMessage="To be added..."
    >
      <form onSubmit={handleAddClient} style={{marginTop: '20px', marginBottom: '20px'}} autoComplete="off">
        <div>
          <label htmlFor="add-user-given-name">First/given name: </label>
          <input id="add-user-given-name" name="addUserGivenName" {...userGivenName} />{' '}
        </div>
        <br />
        <div>
          <label htmlFor="add-user-last-name">Last/family name: </label>
          <input id="add-user-last-name" name="addUserFamilyName" {...userFamilyName} />{' '}
        </div>
        <br />
        <div>
          <label htmlFor="add-username">
            Add username to client list (i.e., username without{' '}
            {SOLID_IDENTITY_PROVIDER.split('/')[2]}):{' '}
          </label>
          <br />
          <br />
          <input id="add-username" name="addUsername" size="25" {...username} />{' '}
        </div>
        <br />
        <button type="submit" disabled={state.processing}>
          Add Client
        </button>
      </form>
    </FormSection>
  );
  /* eslint-enable jsx-a11y/label-has-associated-control */
};

export default AddClient;