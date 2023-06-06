// React Imports
import React, { useContext, useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useSession } from '@inrupt/solid-ui-react';

// Utility Imports
import { runNotification, clearProcessing } from '../../utils';


// Custom Hook Imports
import { useStatusNotification } from '../../hooks';
// Context Imports
import { UserListContext } from '../../contexts';
import registerPod from '../../utils/network/register-pod';

// Component Imports
import { createUser } from '../../model-helpers/User';
import FormSection from '../Form/FormSection';

/**
 * ManageUsers Component - Component that allows users to manage other user's
 * Pod URLs from a user's list stored on their own Pod
 *
 * @memberof Forms
 * @name ManageUsers
 */

const formRowStyle = {
  margin: '20px 0'
};

const textFieldStyle = {
  margin: '8px'
};

const notifyStartSubmission = (userObject, state, dispatch) => {

  dispatch({ type: 'SET_PROCESSING' });

  runNotification(
    `Adding user "${userObject.givenName} ${userObject.familyName}" to Solid...`,
    5,
    state,
    dispatch
  );
};

const notifyEndSubmission = (userObject, state, dispatch) => {
  runNotification(
    `User "${userObject.givenName} ${userObject.familyName}" added to Solid`,
    5,
    state,
    dispatch
  );

  clearProcessing(dispatch);
};

const ManageUsers = () => {
  const { state, dispatch } = useStatusNotification();
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [username, setUsername] = useState('');
  const { addUser } = useContext(UserListContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword ] = useState('');

  const { session } = useSession();

  const clearForm = () => {
    setFamilyName('');
    setGivenName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const submitUser = async () => {
    const { webId, podBaseUrl, email: newEmail } = await registerPod({ email, password, confirmPassword });
    const [newUsername] = newEmail.split('@'); 
    const userObject = {
      webId,
      givenName,
      familyName,
      username: newUsername,
      podUrl: podBaseUrl,
    };
    await addUser(createUser(userObject, session));
  };

  // Event handler for adding user from users list
  const handleAddUser = async (event) => {
    event.preventDefault();
    const userObject = {
      givenName,
      familyName,
      username,
    };

    notifyStartSubmission(userObject, state, dispatch);
    try {
      await submitUser();
    } finally {
      notifyEndSubmission(userObject, state, dispatch);
      clearForm();
    }
  };

  return (
    <FormSection
      title="Add New User"
      state={state}
      statusType="Status"
      defaultMessage="To be added..."
    >
      <form onSubmit={handleAddUser} style={formRowStyle} autoComplete="off">
        <p>Register user for a new pod:</p>
        <TextField
          style={textFieldStyle}
          id="first-name-form"
          aria-label="First Name"
          label="First/Given Name"
          variant="outlined"
          value={givenName}
          onChange={(e) => setGivenName(e.target.value)}
        />
        <br />
        <TextField
          style={textFieldStyle}
          id="last-name-form"
          aria-label="Family Name"
          label="Last/Family Name"
          variant="outlined"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
        />
        <br />
        <TextField
        style={textFieldStyle}
        id="email-form"
        aria-label="Email"
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <TextField
          style={textFieldStyle}
          id="password-form"
          aria-label="Password"
          label="Password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <TextField
          style={textFieldStyle}
          id="confirm-password-form"
          aria-label="Confirm Password"
          label="Confirm Password"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <br />
        <Button
          variant="contained"
          color="primary"
          size="large"
          aria-label="Sign Up For a Pod"
          type="submit"
        >
          Sign Up for a Pod
        </Button>
      </form>
    </FormSection>
  );
};

export default ManageUsers;