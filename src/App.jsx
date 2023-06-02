// React Imports
import React, { useEffect, useMemo, useState } from 'react';
// Inrupt Imports
import { getPodUrlAll } from '@inrupt/solid-client';
import { useSession } from '@inrupt/solid-ui-react';
// Utility Imports
import { createDocumentContainer, createOutbox, getInboxMessageTTL } from './utils';
import { updateUserActivity, UserList, LoadUserList } from './models';
// Custom Hook Imports
import { useRedirectUrl } from './hooks';
// Context Imports
import {
  InboxMessageContext,
  SelectUserContext,
  UserListContext,
  SignedInPodContext
} from './contexts';
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
  const [userList, setUserList] = useState(new UserList({}, [], ''));
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadMessages, setLoadMessages] = useState(true);
  const [signedInPod, setSignedInPod] = useState('');

  const selectedUserObject = useMemo(() => ({ selectedUser, setSelectedUser }), [selectedUser]);
  const userListObject = useMemo(
    () => ({
      userList
    }),
    [userList.list]
  );
  const signedInPodMemo = useMemo(() => ({ signedInPod, setSignedInPod }), [signedInPod]);

  /** @type {inboxListObject[]} */
  const initialInboxList = [];
  const [inboxList, setInboxList] = useState(initialInboxList);
  const inboxMessageObject = useMemo(() => ({ inboxList, setInboxList }), [inboxList]);

  useEffect(() => {
    /**
     * A function that generates a Users container if logging in for the first
     * time and initalizes the list of users from Solid
     *
     * @function fetchData
     */
    async function fetchData() {
      let podUrl = (await getPodUrlAll(session.info.webId, { fetch: session.fetch }))[0];
      podUrl = podUrl || session.info.webId.split('profile')[0];
      setSignedInPod(podUrl);
      await updateUserActivity(session, podUrl);
      await createDocumentContainer(session, podUrl);
      await createOutbox(session);

      setLoadingUsers(true);
      setUserList(await LoadUserList(session, podUrl));
      setLoadingUsers(false);

      const messagesInSolid = await getInboxMessageTTL(session, inboxList);
      messagesInSolid.sort((a, b) => b.uploadDate - a.uploadDate);
      setInboxList(messagesInSolid);
      setLoadMessages(false);
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
            <SignedInPodContext.Provider value={signedInPodMemo}>
              <AppRoutes
                isLoggedIn={session.info.isLoggedIn}
                loadingUsers={loadingUsers}
                loadingActive={false}
                loadMessages={loadMessages}
              />
            </SignedInPodContext.Provider>
          </InboxMessageContext.Provider>
        </UserListContext.Provider>
      </SelectUserContext.Provider>
    </Layout>
  );
};

export default App;
