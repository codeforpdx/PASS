import React, { useEffect, useMemo, useState } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { Login, Logout } from './components/Login';
import {
  UploadDocumentForm,
  FetchDocumentForm,
  DeleteDocumentForm,
  CrossPodQueryForm,
  CrossPodWriteForm,
  SetAclPermissionForm,
  ManageUsers
} from './components/Form';
import UsersList from './components/Users/UsersList';
import { SelectUserContext, UserListContext } from './contexts';
import {
  getUsersFromPod,
  generateActivityTTL,
  generateUsersList,
  updateUserActivity
} from './utils';

/**
 * @typedef {import("./typedefs").userListObject} userListObject
 */

const AppHeader = () => (
  <header>
    <h2>Getting Started with PASS</h2>
  </header>
);

const App = () => {
  const { session } = useSession();
  const [selectedUser, setSelectedUser] = useState('');
  /** @type {[userListObject[], React.Dispatch<React.SetStateAction<userListObject[]>>]} */
  const [userList, setUserList] = useState([]);
  const selectedUserObject = useMemo(() => ({ selectedUser, setSelectedUser }), [selectedUser]);
  const userListObject = useMemo(() => ({ userList, setUserList }), [userList]);

  useEffect(() => {
    /**
     * A function that generates a Users container if logging in for the first
     * time and initalizes the list of users from Solid
     *
     * @function fetchData
     */
    async function fetchData() {
      await generateUsersList(session);
      await generateActivityTTL(session);
      await updateUserActivity(session);
      try {
        const listUsers = await getUsersFromPod(session);
        setUserList(listUsers);
      } catch {
        setUserList([]);
      }
    }

    if (session.info.isLoggedIn) {
      fetchData();
    }
  }, [session.info.isLoggedIn]);

  return (
    <>
      <AppHeader />
      {!session.info.isLoggedIn ? (
        <Login />
      ) : (
        <main>
          <SelectUserContext.Provider value={selectedUserObject}>
            <UserListContext.Provider value={userListObject}>
              <Logout />
              <UploadDocumentForm />
              <FetchDocumentForm />
              <DeleteDocumentForm />
              <ManageUsers />
              <UsersList />
              <SetAclPermissionForm />
              <CrossPodQueryForm />
              <CrossPodWriteForm />
            </UserListContext.Provider>
          </SelectUserContext.Provider>
        </main>
      )}
    </>
  );
};

export default App;
