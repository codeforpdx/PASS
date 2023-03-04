import React from 'react';
import { SessionProvider } from '@inrupt/solid-ui-react';
import Login from './components/Login/Login';
import {
  UploadDocumentForm,
  FetchDocumentForm,
  DeleteDocumentForm,
  CrossPodQueryForm,
  CrossPodWriteForm,
  SetAclPermissionForm
} from './components/Form';

const AppHeader = () => (
  <header>
    <h2>Getting Started with PASS</h2>
  </header>
);

const App = () => (
  <>
    <AppHeader />
    <SessionProvider>
      <main>
        <Login />
        <UploadDocumentForm />
        <FetchDocumentForm />
        <DeleteDocumentForm />
        <SetAclPermissionForm />
        <CrossPodQueryForm />
        <CrossPodWriteForm />
      </main>
    </SessionProvider>
  </>
);

export default App;
