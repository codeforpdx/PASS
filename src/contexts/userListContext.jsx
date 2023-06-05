import React, { createContext, useState, useMemo, useEffect } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { getPodUrlAll } from '@inrupt/solid-client';
import { loadUserList, addUser, removeUser } from '../model-helpers';

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
      let podUrl = (await getPodUrlAll(session.info.webId, { fetch: session.fetch }))[0];
      podUrl = podUrl || session.info.webId.split('profile')[0];

      try {
        setUserListObject(await loadUserList(session, podUrl));
      } finally {
        setLoadingUsers(false);
      }
    };

    if (session.info.isLoggedIn) loadUsers();
  }, [session.info.isLoggedIn]);

  return <UserListContext.Provider value={userListMemo}>{children}</UserListContext.Provider>;
};

export default UserListContext;
