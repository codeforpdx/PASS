import { createContext } from 'react';

/**
 * @typedef {import("../typedefs").outboxListObject} outboxListObject
 */

/** @type {outboxListObject[]} */
const initialOutboxMessageContext = [];

/**
 * React Context for outbox messages from Solid Pod
 *
 * @name OutboxMessageContext
 * @memberof contexts
 */

const OutboxMessageContext = createContext(initialOutboxMessageContext);

export default OutboxMessageContext;
