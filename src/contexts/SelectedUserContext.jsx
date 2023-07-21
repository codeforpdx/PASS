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
  const { podUrl } = useContext(SignedInUserContext);
  const [selectedUser, setSelectedUser] = useState({ podUrl });

  const selectedUserMemo = useMemo(
    () => ({
      selectedUser,
      setSelectedUser: async (user) => setSelectedUser(user || { podUrl, username: '' })
    }),
    [selectedUser, podUrl]
  );

  useEffect(() => {
    if (podUrl) setSelectedUser({ podUrl, username: '' });
  }, [podUrl]);

  return (
    <SelectedUserContext.Provider value={selectedUserMemo}>{children}</SelectedUserContext.Provider>
  );
};
