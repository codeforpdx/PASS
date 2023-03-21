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

const AppHeader = () => (
  <nav className="teal darken-3" role="navigation">
    {/* Experimenting with navbar links and menu. These currently do not link to anything */}
    <div className="nav-wrapper">
      <a href="/" className="left">
        <h4>Getting Started with PASS</h4>
      </a>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        <li>
          <a href="/">My Files</a>
        </li>
        <li>
          <a href="/">Account</a>
        </li>
        <li>
          <a href="/">Logout</a>
        </li>
      </ul>
    </div>
  </nav>
);

const App = () => {
  const { session } = useSession();

  return (
    <>
      <AppHeader />
      {!session.info.isLoggedIn ? (
        <Login />
      ) : (
        <main className="row">
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
