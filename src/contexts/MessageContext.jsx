// React Imports
import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { SessionContext } from './SessionContext';
// Utility Imports
import { createPASSContainer } from '../utils';
// Context Imports
import { SignedInUserContext } from './SignedInUserContext';

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
  const { session } = useContext(SessionContext);
  const [numUnreadMessages, setNumUnreadMessages] = useState(0);

  // update unread message notifications when clicking on a unread message
  const updateMessageCountState = (unReadCount) => {
    setNumUnreadMessages(unReadCount);
  };

  const messageObject = useMemo(
    () => ({
      numUnreadMessages,
      setNumUnreadMessages,
      updateMessageCountState
    }),
    [numUnreadMessages]
  );

  /**
   * A function that generates an Inbox/Outbox container if logging in for the
   * first time or if the container is missing
   *
   * @function generateContainers
   */
  const generateContainers = async () => {
    await Promise.all([
      createPASSContainer(session, podUrl, 'Outbox'),
      createPASSContainer(session, podUrl, 'Inbox', { append: true })
    ]);
  };

  useEffect(() => {
    if (podUrl) generateContainers();
  }, [podUrl]);

  return <MessageContext.Provider value={messageObject}>{children}</MessageContext.Provider>;
};
