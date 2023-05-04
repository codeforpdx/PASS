/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useStatusNotification, useField } from '../../hooks';
import { runNotification, addUserToPod, getUserListActivity } from '../../utils';
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
  const { clearValue: clearUserGivenName, ...userGivenName } = useField('text');
  const { clearValue: clearUserFamilyName, ...userFamilyName } = useField('text');
  const { clearValue: clearUserUrl, ...userUrl } = useField('text');
  const { setUserList } = useContext(UserListContext);

  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleOpen2 = () => setOpen2(true);
  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);

  // Event handler for adding user from users list
  const handleAddUser = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const userObject = {
      givenName: event.target.addUserGivenName.value,
      familyName: event.target.addUserFamilyName.value,
      url: event.target.addUserUrl.value
    };

    if (!userObject.url) {
      runNotification(`Operation failed. Reason: No URL provided`, 5, state, dispatch);
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

    let listUsers = await addUserToPod(session, userObject);
    listUsers = await getUserListActivity(session, listUsers);

    setUserList(listUsers);

    runNotification(
      `Adding user "${userObject.givenName} ${userObject.familyName}" to Solid...`,
      5,
      state,
      dispatch
    );

    setTimeout(() => {
      clearUserGivenName();
      clearUserFamilyName();
      clearUserUrl();
      dispatch({ type: 'CLEAR_PROCESSING' });
    }, 3000);
  };

  const formRowStyle = {
    margin: '20px 0'
  };

  return (
    <Dialog open={open2} onClose={handleClose2}>
      <DialogTitle align="center">Add new client</DialogTitle>
      <DialogContent>
        <Container component="" maxWidth="">
          <DialogContentText>Enter new client details below</DialogContentText>
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
                    <input id="add-user-name" name="addUserName" {...userGivenName} />{' '}
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
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={handleClose2}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

export default ManageUsers;
