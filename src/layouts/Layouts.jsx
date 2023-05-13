import React from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { NavBar } from '../components/NavBar';
import { InactivityMessage } from '../components/Notification';

const Layout = ({ children }) => {
  const { session } = useSession();
  return (
    <>
      <NavBar />
      {children}
      {session.info.isLoggedIn && <InactivityMessage />}
    </>
  );
};

export default Layout;
