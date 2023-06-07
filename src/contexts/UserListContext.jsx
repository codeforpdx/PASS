import React, { createContext, useState, useMemo, useEffect, useContext } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { loadUserList, addUser, removeUser } from '../model-helpers';
import { SignedInUserContext } from './SignedInUserContext';

/**
 * @typedef {import("../typedefs").userListObject} userListObject
 */

/** @type {userListObject[]} */
const initialUserListContext = [];

/**
 * React Context for users list from Solid Pod
 *
 * @name UserListContext
 * @memberof contexts
 */
const UserListContext = createContext(initialUserListContext);

export const UserListContextProvider = ({ children }) => {
  const [userListObject, setUserListObject] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(true);
  const { podUrl } = useContext(SignedInUserContext);
  const { session } = useSession();

  const userListMemo = useMemo(
    () => ({
      userListObject,
      addUser: async (user) => setUserListObject(await addUser(user, session, userListObject)),
      removeUser: async (user) =>
        setUserListObject(await removeUser(user, session, userListObject)),
      loadingUsers
    }),
    [userListObject, loadingUsers]
  );

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setUserListObject(await loadUserList(session, podUrl));
      } finally {
        setLoadingUsers(false);
      }
    };

    if (podUrl) loadUsers();
  }, [podUrl]);

  return <UserListContext.Provider value={userListMemo}>{children}</UserListContext.Provider>;
};

export default UserListContext;
