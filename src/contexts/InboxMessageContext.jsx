import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { useSession } from '@inrupt/solid-ui-react';

import { SignedInUserContext } from './SignedInUserContext';

// Utility Imports
import { createOutbox, createInbox, getInboxMessageTTL } from '../utils';

/**
 * @typedef {import("../typedefs").inboxListObject} inboxListObject
 */

/** @type {inboxListObject[]} */
const initialInboxMessageContext = [];

/**
 * React Context for inbox messages from Solid Pod
 *
 * @name InboxMessageContext
 * @memberof contexts
 */
const InboxMessageContext = createContext(initialInboxMessageContext);

export const InboxMessageContextProvider = ({ children }) => {
  const { podUrl } = useContext(SignedInUserContext);
  const [inboxList, setInboxList] = useState([]);
  const inboxMessageObject = useMemo(() => ({ inboxList, setInboxList }), [inboxList]);
  const { session } = useSession();

  /**
   * A function that generates a Users container if logging in for the first
   * time and initalizes the list of users from Solid
   *
   * @function fetchData
   */
  const fetchData = async () => {
    await Promise.all([createOutbox(session, podUrl), createInbox(session, podUrl)]);
    await getInboxMessageTTL(session, inboxList).then((messages) => {
      messages.sort((a, b) => b.uploadDate - a.uploadDate);
      setInboxList(messages);
    });
  };

  useEffect(() => {
    if (podUrl) fetchData();
  }, [podUrl]);

  return (
    <InboxMessageContext.Provider value={inboxMessageObject}>
      {children}
    </InboxMessageContext.Provider>
  );
};

export default InboxMessageContext;
