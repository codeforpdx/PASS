// React Imports
import React, { useEffect, useState } from 'react';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';

// Custom Hook Imports
import { useRedirectUrl } from './hooks';
// Context Imports
// Component Imports
import LandingPage from './routes/LandingPage';
import Home from './routes/Home';


/**
 * @typedef {import("./typedefs").userListObject} userListObject
 */

/**
 * @typedef {import("./typedefs").inboxListObject} inboxListObject
 */

const App = () => {
  const { session } = useSession();
  const redirectUrl = useRedirectUrl();
  const [restore, setRestore] = useState(false);

  // useEffect to restoring PASS if refreshed in browser
  useEffect(() => {
    const performanceEntries = window.performance.getEntriesByType('navigation');
    if (performanceEntries[0].type === 'reload' && performanceEntries.length === 1) {
      setRestore(true);
    }

    if (restore && localStorage.getItem('loggedIn')) {
      session.login({
        oidcIssuer: localStorage.getItem('oidcIssuer'),
        redirectUrl
      });
    }
  }, [restore]);

  useEffect(() => {
    if (session.info.isLoggedIn) localStorage.setItem('loggedIn', true);
  }, [session.info.isLoggedIn]);

  return session.info.isLoggedIn ? 
    <Home/> : <LandingPage/>
};

export default App;
