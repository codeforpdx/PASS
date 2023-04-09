import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { handleIncomingRedirect } from '@inrupt/solid-client-authn-browser';
import { useSession } from '@inrupt/solid-ui-react';
import { Login } from './components/Login';
import AppHeader from './components/AppHeader';
import Forms from './components/Forms';
import { UserSection } from './components/Users';
import { SelectUserContext, UserListContext, RouterContext } from './contexts';
import {
  getUsersFromPod,
  generateActivityTTL,
  generateUsersList,
  updateUserActivity
} from './utils';

/**
 * @typedef {import("./typedefs").userListObject} userListObject
 */

const App = () => {
  const { session } = useSession();
  const [currentUrl, setCurrentUrl] = useState(window.location.href);

  useEffect(() => {
    handleIncomingRedirect({
      restorePreviousSession: true
    }).then(() => {
      setCurrentUrl(window.location.href);
    });
  }, [setCurrentUrl]);

  const [selectedUser, setSelectedUser] = useState('');
  /** @type {[userListObject[], React.Dispatch<React.SetStateAction<userListObject[]>>]} */
  const [userList, setUserList] = useState([]);

  const currentUrlObject = useMemo(() => ({ currentUrl, setCurrentUrl }), [setCurrentUrl]);
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
    <RouterContext.Provider value={currentUrlObject}>
      <SelectUserContext.Provider value={selectedUserObject}>
        <UserListContext.Provider value={userListObject}>
          <Router>
            <Routes>
              <Route
                exact
                path="/PASS/"
                element={
                  session.info.isLoggedIn ? (
                    <Navigate to="/PASS/home" />
                  ) : (
                    <>
                      <AppHeader isLoggedIn={session.info.isLoggedIn} />
                      <Login currentUrl={currentUrl} />
                    </>
                  )
                }
              />
              <Route
                path="/PASS/home/"
                element={
                  session.info.isLoggedIn ? (
                    <>
                      <AppHeader isLoggedIn={session.info.isLoggedIn} />
                      <UserSection />
                    </>
                  ) : (
                    <Navigate to="/PASS/" />
                  )
                }
              />
              <Route
                path="/PASS/forms/"
                element={
                  session.info.isLoggedIn ? (
                    <>
                      <AppHeader isLoggedIn={session.info.isLoggedIn} />
                      <Forms />
                    </>
                  ) : (
                    <Navigate to="/PASS/" />
                  )
                }
              />
            </Routes>
          </Router>
        </UserListContext.Provider>
      </SelectUserContext.Provider>
    </RouterContext.Provider>
  );
};

export default App;
