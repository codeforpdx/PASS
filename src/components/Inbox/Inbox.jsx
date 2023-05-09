import React from 'react';
import { useLocation } from 'react-router-dom';
import AppHeader from '../AppHeader';
import { Logout } from '../Login';
import NewMessage from './NewMessage';

/**
 * Inbox Component - Component that generates Inbox section for users
 * logged into a Solid Pod via Solid Session
 *
 * @memberof Inbox
 * @name Inbox
 */

const Inbox = () => {
  const location = useLocation();

  localStorage.setItem('restorePath', location.pathname);

  return (
    <>
      <AppHeader />
      <Logout />
      <section id="inbox" className="panel">
        <NewMessage />
        <div>Placeholder; inbox contents will go here.</div>
      </section>
    </>
  );
};

export default Inbox;
