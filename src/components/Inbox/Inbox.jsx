import React from 'react';
import AppHeader from '../AppHeader';
import NewMessage from './NewMessage';

/**
 * Inbox Component - Component that generates Inbox section for users
 * logged into a Solid Pod via Solid Session
 *
 * @memberof Inbox
 * @name Inbox
 */

const Inbox = () => {
  return (
    <>
      <AppHeader />
      <section id="inbox" className="panel">
        <NewMessage />
        <div>
          Placeholder; inbox contents will go here.
        </div>
      </section>
    </>
  );
};

export default Inbox;
