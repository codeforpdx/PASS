import React, { useState, useEffect, useMemo } from 'react';
import { getPodUrlAll } from '@inrupt/solid-client';
import { useSession } from '@inrupt/solid-ui-react';

import { InboxMessageContext, SelectUserContext, UserListContextProvider } from '../contexts';

// Utility Imports
import { createDocumentContainer, createOutbox, getInboxMessageTTL } from '../utils';
import { updateUserActivity } from '../model-helpers';
import Layout from '../layouts/Layouts';
import AppRoutes from '../AppRoutes';

const Home = () => {

  const { session } = useSession();

  const [selectedUser, setSelectedUser] = useState('');
  const [loadMessages, setLoadMessages] = useState(true);

  const selectedUserObject = useMemo(() => ({ selectedUser, setSelectedUser }), [selectedUser]);

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

      await updateUserActivity(session, podUrl);
      await createDocumentContainer(session, podUrl);
      await createOutbox(session);

      const messagesInSolid = await getInboxMessageTTL(session, inboxList);
      messagesInSolid.sort((a, b) => b.uploadDate - a.uploadDate);
      setInboxList(messagesInSolid);
      setLoadMessages(false);
    }

    fetchData();
  }, []);

  return (
    <Layout>
      <SelectUserContext.Provider value={selectedUserObject}>
        <UserListContextProvider>
          <InboxMessageContext.Provider value={inboxMessageObject}>
            <AppRoutes
              loadingActive={false}
              loadMessages={loadMessages}
            />
          </InboxMessageContext.Provider>
        </UserListContextProvider>
      </SelectUserContext.Provider>
    </Layout>
  );
};

export default Home