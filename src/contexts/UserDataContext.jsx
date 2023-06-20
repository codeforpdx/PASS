// React Imports
import React from 'react';
// Context Imports
import {
  MessageContextProvider,
  SelectedUserContextProvider,
  UserListContextProvider,
  SignedInUserContextProvider,
  DocumentListContextProvider
} from '.';

/**
 * A collection of React Contexts used for PASS to be used as a single wrapper
 *
 * @memberof contexts
 * @function UserDataContextProvider
 * @param {React.JSX.Element} children - The wrapped components that consumes
 * Context from Provider
 */

const UserDataContextProvider = ({ children }) => (
  <SignedInUserContextProvider>
    <SelectedUserContextProvider>
      <UserListContextProvider>
        <DocumentListContextProvider>
          <MessageContextProvider>{children}</MessageContextProvider>
        </DocumentListContextProvider>
      </UserListContextProvider>
    </SelectedUserContextProvider>
  </SignedInUserContextProvider>
);

export default UserDataContextProvider;
