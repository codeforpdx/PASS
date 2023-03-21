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

const AppHeader = () => <header>{/* <h2>Getting Started with PASS</h2> */}</header>;

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
