import React, { createContext, useState, useMemo, useEffect } from 'react';
import { getPodUrlAll } from '@inrupt/solid-client';
import { LoadUserList, addUser, removeUser } from '../model-helpers';

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

export const UserListContextProvider = ({ setLoadingUsers, session, children }) => {
  const [userListObject, setUserListObject] = useState({});
  const userListMemo = useMemo(
    () => ({
      userListObject,
      addUser: async (user) => setUserListObject(await addUser(user, session, userListObject)),
      removeUser: async (user) => setUserListObject(await removeUser(user, session, userListObject))
    }),
    [userListObject]
  );

  useEffect(() => {
    const loadUsers = async () => {
      let podUrl = (await getPodUrlAll(session.info.webId, { fetch: session.fetch }))[0];
      podUrl = podUrl || session.info.webId.split('profile')[0];

      setLoadingUsers(true);
      setUserListObject(await LoadUserList(session, podUrl));
      setLoadingUsers(false);
    };

    if (session.info.isLoggedIn) loadUsers();
  }, [session.info.isLoggedIn]);

  return <UserListContext.Provider value={userListMemo}>{children}</UserListContext.Provider>;
};

export default UserListContext;
