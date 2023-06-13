// React Imports
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
// Page Imports
import { useSession } from '@inrupt/solid-ui-react';
import { useRedirectUrl } from './hooks';

import Home from './routes/Home';
import Clients from './routes/Clients';
import Inbox from './routes/Inbox';
import Outbox from './routes/Outbox';
import Forms from './routes/Forms';
import { User } from './routes';

const ProtectedRoute = ({ isLoggedIn, children }) =>
  isLoggedIn ? children ?? <Outlet /> : <Navigate to="/PASS/" replace />;

const AppRoutes = () => {
  const { session } = useSession();
  const redirectUrl = useRedirectUrl();
  const [restore, setRestore] = useState(false);
  const restorePath = localStorage.getItem('restorePath');
  const path = restorePath ?? '/PASS/clients';

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
    <Routes>
      <Route
        exact
        path="/PASS/"
        element={session.info.isLoggedIn ? <Navigate to={path} replace /> : <Home />}
      />
      <Route element={<ProtectedRoute isLoggedIn={session.info.isLoggedIn} />}>
        <Route path="/PASS/clients" element={<Clients />} />
        <Route path="/PASS/user" element={<User />} />
        <Route path="/PASS/forms" element={<Forms />} />
        <Route path="/PASS/inbox" element={<Inbox />} />
        <Route path="/PASS/outbox" element={<Outbox />} />
        <Route path="*" element={<Navigate to={restorePath} replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
