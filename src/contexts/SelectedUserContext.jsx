import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { SignedInUserContext } from './SignedInUserContext';

/**
 * React Context for selecting users from PASS
 *
 * @name SelectedUserContext
 * @memberof contexts
 */

export const SelectedUserContext = createContext({});

export const SelectedUserContextProvider = ({ children }) => {
  const signedInUser = useContext(SignedInUserContext);
  const [selectedUser, setSelectedUser] = useState(signedInUser);

  const selectedUserMemo = useMemo(
    () => ({
      selectedUser,
      selectUser: async (user) => setSelectedUser(user || signedInUser)
    }),
    [selectedUser, signedInUser]
  );

  useEffect(() => {
    const { podUrl } = signedInUser
    if (podUrl) setSelectedUser(signedInUser)
  }, [signedInUser])

  return (
    <SelectedUserContext.Provider value={selectedUserMemo}>{children}</SelectedUserContext.Provider>
  );
};
