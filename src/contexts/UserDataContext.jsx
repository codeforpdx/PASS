// React Imports
import React from 'react';
// Context Imports
import {
  MessageContextProvider,
  DocumentListContextProvider,
  SignedInUserContextProvider
} from '.';

/**
 * A collection of React Contexts used for PASS to be used as a single wrapper
 *
 * @memberof contexts
 * @function UserDataContextProvider
 * @param {React.JSX.Element} children - The components that consume the data context
 * @returns {React.JSX.Element} - A react app
 * Context from Provider
 */
const UserDataContextProvider = ({ children }) => (
  <SignedInUserContextProvider>
    <DocumentListContextProvider>
      <MessageContextProvider>{children}</MessageContextProvider>
    </DocumentListContextProvider>
  </SignedInUserContextProvider>
);

export default UserDataContextProvider;
