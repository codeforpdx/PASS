// React Imports
import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { SessionContext } from './SessionContext';
// Utility Imports
import { createPASSContainer, getMessageTTL } from '../utils';
// Context Imports
import { SignedInUserContext } from './SignedInUserContext';

/**
 * @typedef {import("../typedefs").messageListObject} messageListObject
 */

/**
 * React Context for messages from Solid Pod
 *
 * @name MessageContext
 * @memberof contexts
 */

export const MessageContext = createContext([]);

/**
 * The Provider for MessageContext
 *
 * @memberof contexts
 * @function MessageContextProvider
 * @param {React.JSX.Element} children - The wrapped components that consumes
 * Context from Provider
 */

export const MessageContextProvider = ({ children }) => {
  const { podUrl } = useContext(SignedInUserContext);
  const [loadMessages, setLoadMessages] = useState(true);
  const { session } = useContext(SessionContext);
  const [inboxList, setInboxList] = useState([]);
  const [numUnreadMessages, setNumUnreadMessages] = useState(0);

  // update unread message notifications when clicking on a unread message
  const updateMessageCountState = () => {
    if (numUnreadMessages > 0) {
      setNumUnreadMessages(numUnreadMessages - 1);
    }
  };

  const [outboxList, setOutboxList] = useState([]);
  const messageObject = useMemo(
    () => ({
      inboxList,
      setInboxList,
      outboxList,
      setOutboxList,
      loadMessages,
      setLoadMessages,
      numUnreadMessages,
      setNumUnreadMessages,
      updateMessageCountState
    }),
    [outboxList, inboxList, loadMessages, numUnreadMessages]
  );

  /**
   * A function that generates a Users container if logging in for the first
   * time and initializes the list of users from Solid
   *
   * @function fetchData
   */
  const fetchData = async () => {
    setLoadMessages(true);
    await Promise.all([
      createPASSContainer(session, podUrl, 'Outbox'),
      createPASSContainer(session, podUrl, 'Inbox', { append: true })
    ]);

    try {
      const messagesInboxSolid = await getMessageTTL(session, 'Inbox', inboxList, podUrl);
      messagesInboxSolid.sort((a, b) => b.uploadDate - a.uploadDate);
      setNumUnreadMessages(messagesInboxSolid.reduce((a, m) => (!m.readStatus ? a + 1 : a), 0));
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

  return <MessageContext.Provider value={messageObject}>{children}</MessageContext.Provider>;
};
