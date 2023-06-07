import React, { useState, useMemo } from 'react';

import {
  MessageContextProvider,
  SelectUserContext,
  UserListContextProvider,
  SignedInUserContextProvider
} from '.';

const UserDataContextProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState('');

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
