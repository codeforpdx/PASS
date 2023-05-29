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
  createDocumentContainer,
  createOutbox,
  getMessageTTL
} from './utils';
// Custom Hook Imports
import { useRedirectUrl } from './hooks';
// Context Imports
import { InboxMessageContext, SelectUserContext, UserListContext } from './contexts';
// Page Imports
import Home from './routes/Home';
// Component Imports
import Forms from './components/Forms';
import { Inbox, Outbox } from './components/Inbox';
import { UserSection } from './components/Users';
import Layout from './layouts/Layouts';
import OutboxMessageContext from './contexts/outboxMessageContext';

/**
 * @typedef {import("./typedefs").userListObject} userListObject
 */

/**
 * @typedef {import("./typedefs").messageListObject} messageListObject
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
        oidcIssuer: localStorage.getItem('oidcIssuer'),
        redirectUrl
      });
    }
  }, [restore]);

  const [selectedUser, setSelectedUser] = useState('');
  /** @type {userListObject[]} */
  const initialUserList = [];
  const [userList, setUserList] = useState(initialUserList);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingActive, setLoadingActive] = useState(true);
  const [loadInboxMessages, setLoadInboxMessages] = useState(true);
  const [loadOutboxMessages, setLoadOutboxMessages] = useState(true);

  const selectedUserObject = useMemo(() => ({ selectedUser, setSelectedUser }), [selectedUser]);
  const userListObject = useMemo(() => ({ userList, setUserList }), [userList]);

  /** @type {messageListObject[]} */
  const initialInboxList = [];
  const [inboxList, setInboxList] = useState(initialInboxList);
  const inboxMessageObject = useMemo(() => ({ inboxList, setInboxList }), [inboxList]);

  /** @type {messageListObject[]} */
  const initialOutboxList = [];
  const [outboxList, setOutboxList] = useState(initialOutboxList);
  const outboxMessageObject = useMemo(() => ({ outboxList, setOutboxList }), [outboxList]);

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
      await createOutbox(session);
      try {
        let listUsers = await getUsersFromPod(session);
        setUserList(listUsers);
        setLoadingUsers(false);
        listUsers = await getUserListActivity(session, listUsers);
        setUserList(listUsers);
        setLoadingActive(false);
      } catch {
        setUserList([]);
        setLoadingUsers(false);
        setLoadingActive(false);
      }

      const messagesInboxSolid = await getMessageTTL(session, 'Inbox', inboxList);
      messagesInboxSolid.sort((a, b) => b.uploadDate - a.uploadDate);
      setInboxList(messagesInboxSolid);
      setLoadInboxMessages(false);

      const messagesOutboxSolid = await getMessageTTL(session, 'Outbox', outboxList);
      messagesOutboxSolid.sort((a, b) => b.uploadDate - a.uploadDate);
      setOutboxList(messagesOutboxSolid);
      setLoadOutboxMessages(false);
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
          <InboxMessageContext.Provider value={inboxMessageObject}>
            <OutboxMessageContext.Provider value={outboxMessageObject}>
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
                  element={
                    session.info.isLoggedIn ? (
                      <Inbox loadMessages={loadInboxMessages} />
                    ) : (
                      <Navigate to="/PASS/" />
                    )
                  }
                />
                <Route
                  path="/PASS/outbox"
                  element={
                    session.info.isLoggedIn ? (
                      <Outbox loadMessages={loadOutboxMessages} />
                    ) : (
                      <Navigate to="/PASS/" />
                    )
                  }
                />
                <Route path="*" element={<Navigate to="/PASS/" />} />
              </Routes>
            </OutboxMessageContext.Provider>
          </InboxMessageContext.Provider>
        </UserListContext.Provider>
      </SelectUserContext.Provider>
    </Layout>
  );
};

export default App;
