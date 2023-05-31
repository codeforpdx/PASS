// React Imports
import React, { useEffect, useMemo, useState } from 'react';
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
  getInboxMessageTTL,
  createPublicContainer,
  createInbox
} from './utils';
// Custom Hook Imports
import { useRedirectUrl } from './hooks';
// Context Imports
import { InboxMessageContext, SelectUserContext, UserListContext } from './contexts';
// Component Imports
import Layout from './layouts/Layouts';
import AppRoutes from './AppRoutes';

/**
 * @typedef {import("./typedefs").userListObject} userListObject
 */

/**
 * @typedef {import("./typedefs").inboxListObject} inboxListObject
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
  const [loadMessages, setLoadMessages] = useState(true);

  const selectedUserObject = useMemo(() => ({ selectedUser, setSelectedUser }), [selectedUser]);
  const userListObject = useMemo(() => ({ userList, setUserList }), [userList]);

  /** @type {inboxListObject[]} */
  const initialInboxList = [];
  const [inboxList, setInboxList] = useState(initialInboxList);
  const inboxMessageObject = useMemo(() => ({ inboxList, setInboxList }), [inboxList]);

  useEffect(() => {
    /**
     * A function that sets up a user's Pod if logging in for the first time or
     * if containers are deleted and initializes user data from Solid Pod
     *
     * @function setupPod
     */
    async function setupPod() {
      await createPublicContainer(session);
      await generateUsersList(session);
      await generateActivityTTL(session);
      await updateUserActivity(session);
      await createDocumentContainer(session);
      await createInbox(session);
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

      const messagesInSolid = await getInboxMessageTTL(session, inboxList);
      messagesInSolid.sort((a, b) => b.uploadDate - a.uploadDate);
      setInboxList(messagesInSolid);
      setLoadMessages(false);
    }

    if (session.info.isLoggedIn) {
      localStorage.setItem('loggedIn', true);
      setupPod();
    }
  }, [session.info.isLoggedIn]);

  return (
    <Layout>
      <SelectUserContext.Provider value={selectedUserObject}>
        <UserListContext.Provider value={userListObject}>
          <InboxMessageContext.Provider value={inboxMessageObject}>
            <AppRoutes
              isLoggedIn={session.info.isLoggedIn}
              loadingUsers={loadingUsers}
              loadingActive={loadingActive}
              loadMessages={loadMessages}
            />
          </InboxMessageContext.Provider>
        </UserListContext.Provider>
      </SelectUserContext.Provider>
    </Layout>
  );
};

export default App;
