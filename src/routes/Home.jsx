import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useSession } from '@inrupt/solid-ui-react';

import { InboxMessageContext, SelectUserContext, UserListContextProvider, SignedInUserContext } from '../contexts';

// Utility Imports
import { createDocumentContainer, createOutbox, getInboxMessageTTL } from '../utils';
import { updateUserActivity } from '../model-helpers';
import Layout from '../layouts/Layouts';
import AppRoutes from '../AppRoutes';

const Home = () => {

  const { session } = useSession();
  const { podUrl } = useContext(SignedInUserContext);

  const [selectedUser, setSelectedUser] = useState('');
  const [loadMessages, setLoadMessages] = useState(true);
  const [inboxList, setInboxList] = useState([]);

  const selectedUserObject = useMemo(() => ({ selectedUser, setSelectedUser }), [selectedUser]);
  const inboxMessageObject = useMemo(() => ({ inboxList, setInboxList }), [inboxList]);

  useEffect(() => {
    /**
     * A function that generates a Users container if logging in for the first
     * time and initalizes the list of users from Solid
     *
     * @function fetchData
     */
    const fetchData = async () => {
      await Promise.all([
        updateUserActivity(session, podUrl),
        createDocumentContainer(session, podUrl),
        createOutbox(session),
        getInboxMessageTTL(session, inboxList).then((messages) => {
          messages.sort((a,b) => b.uploadDate - a.uploadDate)
          setInboxList(messages);
          setLoadMessages(false);
        })
      ]);
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