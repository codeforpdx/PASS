// React Imports
import React, { useEffect, useState } from 'react';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';

// Custom Hook Imports
import { useRedirectUrl } from './hooks';
// Component Imports
import GlobalDataContextProvider from './contexts/GlobalDataContext';
import Layout from './layouts/Layout';
import AppRoutes from './AppRoutes';


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

  return (
      <Layout ariaLabel="Home Page">
        <GlobalDataContextProvider>
          <AppRoutes />
        </GlobalDataContextProvider>
      </Layout>
  )
};

export default App;
