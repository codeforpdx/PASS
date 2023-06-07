// React Imports
import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Utility Imports
import {
  getUsersFromPod,
  generateActivityTTL,
  generateUsersList,
  updateUserActivity,
  getUserListActivity,
  SOLID_IDENTITY_PROVIDER,
  createDocumentContainer
} from './utils';
// Custom Hook Imports
import { useRedirectUrl } from './hooks';
// Context Imports
import { SelectUserContext, UserListContext } from './contexts';
// Page Imports
import Home from './routes/Home';
// Component Imports
import Forms from './components/Forms';
import { Inbox } from './components/Inbox';
import { UserSection } from './components/Users';
import Layout from './layouts/Layouts';

/**
 * @typedef {import("./typedefs").userListObject} userListObject
 */

const App = () => {
  const { session } = useSession();
  const redirectUrl = useRedirectUrl();
  const [restore, setRestore] = useState(false);

  // useEffect to restoring PASS if refreshed in browser
  useEffect(() => {
    const performanceEntries = window.performance.getEntriesByType('navigation');
    if (performanceEntries[0].type === 'reload' && performanceEntries.length === 1) {
      setRestore(true);
    }

    if (restore && localStorage.getItem('loggedIn')) {
      session.login({
        oidcIssuer: SOLID_IDENTITY_PROVIDER,
        redirectUrl
      });
    }
  }, [restore]);

  const [selectedUser, setSelectedUser] = useState('');
  /** @type {useState<userListObject[]>} */
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
      await createDocumentContainer(session);
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
      localStorage.setItem('loggedIn', true);
      fetchData();
    }
  }, [session.info.isLoggedIn]);

  return (
    <Layout>
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
                        ? '/PASS/home'
                        : localStorage.getItem('restorePath')
                    }
                  />
                ) : (
                  <Home />
                )
              }
            />
            <Route
              path="/PASS/home"
              element={
                session.info.isLoggedIn ? (
                  <UserSection loadingUsers={loadingUsers} loadingActive={loadingActive} />
                ) : (
                  <Navigate to="/PASS/" />
                )
              }
            />
            <Route
              path="/PASS/forms"
              element={session.info.isLoggedIn ? <Forms /> : <Navigate to="/PASS/" />}
            />
            <Route
              path="/PASS/inbox"
              element={session.info.isLoggedIn ? <Inbox /> : <Navigate to="/PASS/" />}
            />
            <Route path="*" element={<Navigate to="/PASS/" />} />
          </Routes>
        </UserListContext.Provider>
      </SelectUserContext.Provider>
    </Layout>
  );
};

export default App;
