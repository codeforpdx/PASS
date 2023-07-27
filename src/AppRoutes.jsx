// React Imports
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
// Inrupt Imports
import { useSession } from '@hooks';
// Page Imports
import { Home, Clients, Messages, Profile } from './pages';

const ProtectedRoute = ({ isLoggedIn, children }) =>
  isLoggedIn ? children ?? <Outlet /> : <Navigate to="/" replace />;

/**
 * The main application routing for PASS
 *
 * @name AppRoutes
 * @returns {React.JSX.Element} The main routing component for PASS
 */
const AppRoutes = () => {
  const { session } = useSession();
  const restorePath = localStorage.getItem('restorePath');
  const loggedIn = session.info.isLoggedIn;
  const path = loggedIn ? restorePath || '/clients' : '/';

  return (
    <Routes>
      <Route
        exact
        path="/"
        element={session.info.isLoggedIn ? <Navigate to={path} replace /> : <Home />}
      />
      <Route element={<ProtectedRoute isLoggedIn={session.info.isLoggedIn} />}>
        <Route path="/clients" element={<Clients />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile">
          <Route index element={<Profile />} />
          <Route path=":webId" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to={restorePath} replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
