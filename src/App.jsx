import React, { useMemo, useState } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { Login, Logout } from './components/Login';
import {
  UploadDocumentForm,
  FetchDocumentForm,
  DeleteDocumentForm,
  CrossPodQueryForm,
  CrossPodWriteForm,
  SetAclPermissionForm
} from './components/Form';
import ManageUsers from './components/Form/ManageUsers';
import SelectUserContext from './contexts/selectUserContext';

const AppHeader = () => (
  <header>
    <h2>Getting Started with PASS</h2>
  </header>
);

const App = () => {
  const { session } = useSession();
  const [selectedUser, setSelectedUser] = useState('');
  const selectedUserObject = useMemo(() => ({ selectedUser, setSelectedUser }), [selectedUser]);

  return (
    <>
      <AppHeader />
      {!session.info.isLoggedIn ? (
        <Login />
      ) : (
        <main>
          <SelectUserContext.Provider value={selectedUserObject}>
            <Logout />
            <ManageUsers />
            <UploadDocumentForm />
            <FetchDocumentForm />
            <DeleteDocumentForm />
            <SetAclPermissionForm />
            <CrossPodQueryForm />
            <CrossPodWriteForm />
          </SelectUserContext.Provider>
        </main>
      )}
    </>
  );
};

export default App;
