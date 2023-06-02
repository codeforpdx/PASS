// React Imports
import React, { useEffect, useMemo, useState } from 'react';
// Inrupt Imports
import { getPodUrlAll } from '@inrupt/solid-client';
import { useSession } from '@inrupt/solid-ui-react';
// Utility Imports
import { createDocumentContainer, createOutbox, getMessageTTL } from './utils';
import { updateUserActivity } from './model-helpers';
// Custom Hook Imports
import { useRedirectUrl } from './hooks';
// Context Imports
import {
  InboxMessageContext,
  OutboxMessageContext,
  SelectUserContext,
  UserListContextProvider
} from './contexts';
// Component Imports
import Layout from './layouts/Layouts';
import AppRoutes from './AppRoutes';

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
  const [loadInboxMessages, setLoadInboxMessages] = useState(true);
  const [loadOutboxMessages, setLoadOutboxMessages] = useState(true);

  const selectedUserObject = useMemo(() => ({ selectedUser, setSelectedUser }), [selectedUser]);

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
      let podUrl = (await getPodUrlAll(session.info.webId, { fetch: session.fetch }))[0];
      podUrl = podUrl || session.info.webId.split('profile')[0];

      await updateUserActivity(session, podUrl);
      await createDocumentContainer(session, podUrl);
      await createOutbox(session);

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
        <UserListContextProvider session={session}>
          <InboxMessageContext.Provider value={inboxMessageObject}>
            <OutboxMessageContext.Provider value={outboxMessageObject}>
              <AppRoutes
                isLoggedIn={session.info.isLoggedIn}
                loadingActive={false}
                loadInboxMessages={loadInboxMessages}
                loadOutboxMessages={loadOutboxMessages}
              />
            </OutboxMessageContext.Provider>
          </InboxMessageContext.Provider>
        </UserListContextProvider>
      </SelectUserContext.Provider>
    </Layout>
  );
};

export default App;
