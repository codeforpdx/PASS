import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useSession } from '@inrupt/solid-ui-react';

import {
  InboxMessageContext,
  SelectUserContext,
  UserListContextProvider,
  SignedInUserContext,
  SignedInUserContextProvider
} from '.';

// Utility Imports
import {
  createDocumentContainer,
  createPublicContainer,
  createOutbox,
  createInbox,
  getInboxMessageTTL
} from '../utils';
import { updateUserActivity } from '../model-helpers';

const GlobalDataContextProvider = ({children}) => {
  const { session } = useSession();
  const { podUrl } = useContext(SignedInUserContext);

  const [selectedUser, setSelectedUser] = useState('');
  const [inboxList, setInboxList] = useState([]);

  const selectedUserObject = useMemo(() => ({ selectedUser, setSelectedUser }), [selectedUser]);
  const inboxMessageObject = useMemo(() => ({ inboxList, setInboxList }), [inboxList]);

  /**
   * A function that generates a Users container if logging in for the first
   * time and initalizes the list of users from Solid
   *
   * @function fetchData
   */
  const fetchData = async () => {
    await Promise.all([
      updateUserActivity(session, podUrl),
      createPublicContainer(session, podUrl),
      createDocumentContainer(session, podUrl),
      createOutbox(session, podUrl),
      createInbox(session, podUrl),
      getInboxMessageTTL(session, inboxList).then((messages) => {
        messages.sort((a, b) => b.uploadDate - a.uploadDate);
        setInboxList(messages);
      })
    ]);
  };

  useEffect(() => {
    if (podUrl) fetchData();
  }, [podUrl]);

  return (
    <SignedInUserContextProvider>
      <SelectUserContext.Provider value={selectedUserObject}>
        <UserListContextProvider>
          <InboxMessageContext.Provider value={inboxMessageObject}>
            {children}
          </InboxMessageContext.Provider>
        </UserListContextProvider>
      </SelectUserContext.Provider>
    </SignedInUserContextProvider>
  );
};

export default GlobalDataContextProvider;
