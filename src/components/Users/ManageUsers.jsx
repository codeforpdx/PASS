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
  const { addUser } = useContext(UserListContext);
  const [dateOfBirth, setDateOfBirth] = useState(Date.now());
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { session } = useSession();

  const clearForm = () => {
    setFamilyName('');
    setGivenName('');
    setDateOfBirth(Date.now());
    setPassword('');
    setConfirmPassword('');
  };

  const submitUser = async () => {
    const [year] = dateOfBirth.split('-');
    const tempEmail = `${givenName}.${familyName}.${year}@fake.com`;
    const { webId, podBaseUrl, email } = await registerPod({
      email: tempEmail,
      password,
      confirmPassword
    });
    const [newUsername] = email.split('@');
    const userObject = {
      webId,
      givenName,
      familyName,
      email,
      username: newUsername,
      podUrl: podBaseUrl,
      dateOfBirth
    };
    await addUser(createUser(userObject, session));
  };

  // Event handler for adding user from users list
  const handleAddUser = async (event) => {
    event.preventDefault();
    const userObject = {
      givenName,
      familyName
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
          id="date-form"
          aria-label="Date of Birth"
          label="Date of Birth"
          variant="outlined"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          type="date"
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
