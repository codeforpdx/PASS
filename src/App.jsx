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
import Mockup from './components/Form/Mockup';
import NavBar from './components/Form/NavBar';

const AppFooter = (props) => (
  <Typography
    variant="body2"
    color="text.secondary"
    align="center"
    sx={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      marginBottom: '20px',
      marginTop: '20px',
      padding: '10 10 10 10'
    }}
    {...props}
  >
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
      <div />
      {!session.info.isLoggedIn ? (
        <>
          {/* <Login /> */}
          <Mockup />
        </>
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
        </main>
      )}
      <AppFooter />
    </>
  );
};

export default App;
