import { createContext } from 'react';

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

export default InboxMessageContext;
