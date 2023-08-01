// React Imports
import React from 'react';
// Context Imports
import { MessageContextProvider, DocumentListContextProvider } from '.';

/**
 * A collection of React Contexts used for PASS to be used as a single wrapper
 *
 * @memberof contexts
 * @function UserDataContextProvider
 * @param {React.JSX.Element} children - The wrapped components that consumes
 * Context from Provider
 */
const UserDataContextProvider = ({ children }) => (
  <DocumentListContextProvider>
    <MessageContextProvider>{children}</MessageContextProvider>
  </DocumentListContextProvider>
);

export default UserDataContextProvider;
