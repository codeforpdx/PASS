import React from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { Link, Typography } from '@mui/material';
import { Login, Logout } from './components/Login';
import {
  UploadDocumentForm,
  FetchDocumentForm,
  DeleteDocumentForm,
  CrossPodQueryForm,
  CrossPodWriteForm,
  SetAclPermissionForm
} from './components/Form';
import NavBar from './components/Form/NavBar';

// const AppHeader = () => (
//   <header>
//     <h2>Getting Started with PASS</h2>
//   </header>
// );

const AppFooter = (props) => (
  <Typography variant="body2" color="text.secondary" align="center" {...props}>
    {'Copyright © '}
    <Link color="inherit" href="https://github.com/codeforpdx/PASS">
      codeForPDX
    </Link>{' '}
    {new Date().getFullYear()}
  </Typography>
);

const App = () => {
  const { session } = useSession();

  return (
    <>
      {/* <AppHeader /> */}
      {!session.info.isLoggedIn ? (
        <Login />
      ) : (
        <main>
          <NavBar />
          <Logout />
          <UploadDocumentForm />
          <FetchDocumentForm />
          <DeleteDocumentForm />
          <SetAclPermissionForm />
          <CrossPodQueryForm />
          <CrossPodWriteForm />
          <AppFooter />
        </main>
      )}
    </>
  );
};

export default App;
