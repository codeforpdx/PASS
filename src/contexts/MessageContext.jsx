import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { useSession } from '@inrupt/solid-ui-react';

import { SignedInUserContext } from './SignedInUserContext';

// Utility Imports
import { createOutbox, createInbox, getMessageTTL } from '../utils';

/**
 * @typedef {import("../typedefs").inboxListObject} inboxListObject
 */

/**
 * React Context for inbox messages from Solid Pod
 *
 * @name MessageContext
 * @memberof contexts
 */
const MessageContext = createContext([]);

export const MessageContextProvider = ({ children }) => {
  const { podUrl } = useContext(SignedInUserContext);
  const [loadMessages, setLoadMessages] = useState(true);
  const { session } = useSession();
  const [inboxList, setInboxList] = useState([]);

  const [outboxList, setOutboxList] = useState([]);
  const messageObject = useMemo(() => ({ 
    inboxList,
    setInboxList,
    outboxList,
    setOutboxList,
    loadMessages,
    setLoadMessages
  }), [outboxList, inboxList, loadMessages]);

  /**
   * A function that generates a Users container if logging in for the first
   * time and initalizes the list of users from Solid
   *
   * @function fetchData
   */
  const fetchData = async () => {
    await Promise.all([createOutbox(session, podUrl), createInbox(session, podUrl)]);

    try {
      const messagesInboxSolid = await getMessageTTL(session, 'Inbox', inboxList, podUrl);
      messagesInboxSolid.sort((a, b) => b.uploadDate - a.uploadDate);
      setInboxList(messagesInboxSolid);

      const messagesOutboxSolid = await getMessageTTL(session, 'Outbox', outboxList, podUrl);
      messagesOutboxSolid.sort((a, b) => b.uploadDate - a.uploadDate);
      setOutboxList(messagesOutboxSolid);
    } finally {
      setLoadMessages(false);
    }
  };

  useEffect(() => {
    if (podUrl) fetchData();
  }, [podUrl]);

  return (
    <MessageContext.Provider value={messageObject}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContext;
