// React Imports
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';
// Custom Hook Imports
import { useRedirectUrl } from './hooks';
// Page Imports
import { Home, Clients, Messages, Profile } from './routes';

const ProtectedRoute = ({ isLoggedIn, children }) =>
  isLoggedIn ? children ?? <Outlet /> : <Navigate to="/PASS/" replace />;

/**
 * The main application routing for PASS
 *
 * @name AppRoutes
 * @returns {React.JSX.Element} The main routing component for PASS
 */
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
        <Route path="/PASS/clients/profile" element={<Profile />} />
        <Route path="/PASS/messages" element={<Messages />} />
        <Route path="/PASS/profile" element={<Profile user="personal" />} />
        <Route path="*" element={<Navigate to={restorePath} replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
