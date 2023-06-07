import React, { createContext } from 'react';

/**
 * @typedef {import("../typedefs").userListObject} userListObject
 */

/**
 * React Context for users list from Solid Pod
 *
 * @name UserListContext
 * @memberof contexts
 * @type {React.Context<Array<userListObject>>}
 */

const UserListContext = createContext([]);

export default UserListContext;
