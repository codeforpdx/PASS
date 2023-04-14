import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSession } from '@inrupt/solid-ui-react';
import { Login } from './components/Login';
import Forms from './components/Forms';
import { UserSection } from './components/Users';
import { SelectUserContext, UserListContext } from './contexts';
import { useRedirectUrl } from './hooks';
import {
  getUsersFromPod,
  generateActivityTTL,
  generateUsersList,
  updateUserActivity,
  getUserListActivity,
  SOLID_IDENTITY_PROVIDER
} from './utils';

/**
 * @typedef {import("./typedefs").userListObject} userListObject
 */

const App = () => {
  const { session } = useSession();
  const redirectUrl = useRedirectUrl();
  const [restore, setRestore] = useState(false);

  useEffect(() => {
    const performanceEntries = window.performance.getEntriesByType('navigation');
    if (performanceEntries[0].type === 'reload' && performanceEntries.length === 1) {
      setRestore(true);
    }

    if (restore && localStorage.getItem('loggedIn')) {
      console.log('restoring session');
      session.login({
        oidcIssuer: SOLID_IDENTITY_PROVIDER,
        redirectUrl,
        onError: console.error
      });
    }
  }, [restore]);

  const [selectedUser, setSelectedUser] = useState('');
  /** @type {[userListObject[], React.Dispatch<React.SetStateAction<userListObject[]>>]} */
  const [userList, setUserList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingActive, setLoadingActive] = useState(false);

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
        let listUsers = await getUsersFromPod(session);
        setUserList(listUsers);
        setLoadingUsers(true);
        setLoadingActive(true);
        listUsers = await getUserListActivity(session, listUsers);
        setUserList(listUsers);
        setLoadingActive(false);
      } catch {
        setUserList([]);
        setLoadingUsers(false);
        setLoadingActive(false);
      }
    }

    if (session.info.isLoggedIn) {
      fetchData();
    }
  }, [session.info.isLoggedIn]);

  return (
    <SelectUserContext.Provider value={selectedUserObject}>
      <UserListContext.Provider value={userListObject}>
        <Routes>
          <Route
            exact
            path="/PASS/"
            element={
              session.info.isLoggedIn ? (
                <Navigate
                  to={
                    !localStorage.getItem('restorePath')
                      ? '/PASS/home/'
                      : localStorage.getItem('restorePath')
                  }
                />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/PASS/home/"
            element={
              session.info.isLoggedIn ? (
                <UserSection loadingUsers={loadingUsers} loadingActive={loadingActive} />
              ) : (
                <Navigate to="/PASS/" />
              )
            }
          />
          <Route
            path="/PASS/forms/"
            element={session.info.isLoggedIn ? <Forms /> : <Navigate to="/PASS/" />}
          />
          <Route path="*" element={<Navigate to="/PASS/" />} />
        </Routes>
      </UserListContext.Provider>
    </SelectUserContext.Provider>
  );
};

export default App;
