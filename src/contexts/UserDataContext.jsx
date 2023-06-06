import React, { useState, useMemo } from 'react';

import {
  InboxMessageContextProvider,
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
          <InboxMessageContextProvider>{children}</InboxMessageContextProvider>
        </UserListContextProvider>
      </SelectUserContext.Provider>
    </SignedInUserContextProvider>
  );
};

export default UserDataContextProvider;
