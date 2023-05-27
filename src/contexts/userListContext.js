import { createContext } from 'react';

/**
 * @typedef {import("../typedefs").userListObject} userListObject
 */

/** @type {userListObject[]} */
const initialUserListContext = [];

/**
 * React Context for users list from Solid Pod
 *
 * @name UserListContext
 * @memberof contexts
 */

const UserListContext = createContext(initialUserListContext);

export default UserListContext;
