// React Imports
import React, { useState, useMemo } from 'react';
// Context Imports
import {
  MessageContextProvider,
  SelectUserContext,
  UserListContextProvider,
  SignedInUserContextProvider
} from '.';

/**
 * A collection of React Contexts used for PASS to be used as a single wrapper
 *
 * @memberof contexts
 * @function UserDataContextProvider
 * @param {React.JSX.Element} children - The wrapped components that consumes
 * Context from Provider
 */

const UserDataContextProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState({});

  const selectedUserObject = useMemo(() => ({ selectedUser, setSelectedUser }), [selectedUser]);

  return (
    <SignedInUserContextProvider>
      <SelectUserContext.Provider value={selectedUserObject}>
        <UserListContextProvider>
          <MessageContextProvider>{children}</MessageContextProvider>
        </UserListContextProvider>
      </SelectUserContext.Provider>
    </SignedInUserContextProvider>
  );
};

export default UserDataContextProvider;
