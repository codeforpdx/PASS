import React, { useContext } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useStatusNotification, useField } from '../../hooks';
import { runNotification, addUserToPod } from '../../utils';
import FormSection from './FormSection';
import { UserListContext } from '../../contexts';

/**
 * ManageUsers Component - Component that allows users to manage other user's
 * Pod URLs from a user's list stored on their own Pod
 *
 * @memberof Forms
 * @name ManageUsers
 */

const ManageUsers = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const { clearValue: clearUserName, ...userName } = useField('text');
  const { clearValue: clearUserUrl, ...userUrl } = useField('text');
  const { setUserList } = useContext(UserListContext);

  // Event handler for adding user from users list
  const handleAddUser = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const userObject = {
      name: event.target.addUserName.value,
      url: event.target.addUserUrl.value
    };

    if (!userObject.url) {
      runNotification(`Operation failed. Reason: No URL provided`, 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
      return;
    }

    if (!userObject.name) {
      runNotification(`Operation failed. Reason: User's name is not provided`, 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
      return;
    }

    const listUsers = await addUserToPod(session, userObject);
    setUserList(listUsers);

    runNotification(`Adding user "${userObject.name}" to Solid...`, 5, state, dispatch);

    setTimeout(() => {
      clearUserName();
      clearUserUrl();
      dispatch({ type: 'CLEAR_PROCESSING' });
    }, 3000);
  };

  const formRowStyle = {
    margin: '20px 0'
  };

  return (
    <Container component="" maxWidth="">
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
            title="Manage Users"
            state={state}
            statusType="Status"
            defaultMessage="To be added..."
          >
            <form onSubmit={handleAddUser} style={formRowStyle} autoComplete="off">
              <div>
                <label htmlFor="add-user-name">User's name (i.e. John Doe): </label>
                <input id="add-user-name" name="addUserName" {...userName} />{' '}
              </div>
              <br />
              <div>
                <label htmlFor="add-user-url">
                  Add Pod URL to users list (i.e., username.opencommons.net):{' '}
                </label>
                <br />
                <br />
                <input id="add-user-url" name="addUserUrl" size="60" {...userUrl} />{' '}
              </div>
              <br />
              <button type="submit" disabled={state.processing}>
                Add User
              </button>
            </form>
          </FormSection>
        </Paper>
      </Box>
    </Container>
  );
};

export default ManageUsers;
