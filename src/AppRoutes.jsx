// React Imports
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
// Inrupt Imports
import { useSession } from '@hooks';
import { SessionProvider } from '@contexts';
import { CIVIC_FORM_LIST, FormLayout } from '@components/CivicProfileForms';
// Page Imports
import { CivicProfile, Home, Contacts, Messages, Profile, Signup } from './pages';

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
  const path = loggedIn ? restorePath || '/contacts' : '/';

  return (
    <Routes>
      <Route
        exact
        path="/"
        element={session.info.isLoggedIn ? <Navigate to={path} replace /> : <Home />}
      />
      <Route
        path="/signup"
        element={
          <SessionProvider>
            <Signup />
          </SessionProvider>
        }
      />
      <Route element={<ProtectedRoute isLoggedIn={session.info.isLoggedIn} />}>
        <Route path="/contacts">
          <Route index element={<Contacts />} />
          <Route path=":webId" element={<Profile />} />
        </Route>
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/civic-profile" element={<CivicProfile />}>
          {CIVIC_FORM_LIST.map((formProps) => (
            <Route
              {...formProps}
              element={
                <FormLayout>
                  <formProps.element />
                </FormLayout>
              }
            />
          ))}
        </Route>
        <Route path="*" element={<Navigate to={restorePath} replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
