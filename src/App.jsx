import React from 'react';
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

const AppHeader = () => (
  <header>
    <h2>Getting Started with PASS</h2>
  </header>
);

const App = () => {
  const { session } = useSession();

  return (
    <>
      <AppHeader />
      {!session.info.isLoggedIn ? (
        <Login />
      ) : (
        <main>
          <Logout />
          <ManageUsers />
          <UploadDocumentForm />
          <FetchDocumentForm />
          <DeleteDocumentForm />
          <SetAclPermissionForm />
          <CrossPodQueryForm />
          <CrossPodWriteForm />
        </main>
      )}
    </>
  );
};

export default App;
