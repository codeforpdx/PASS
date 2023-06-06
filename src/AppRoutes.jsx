// React Imports
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
// Page Imports
import Home from './routes/Home';
import Clients from './routes/Clients';
import Inbox from './routes/Inbox';
import Outbox from './routes/Outbox';
import Forms from './routes/Forms';

const ProtectedRoute = ({ isLoggedIn, children }) =>
  isLoggedIn ? children ?? <Outlet /> : <Navigate to="PASS/" replace />;

const AppRoutes = ({
  isLoggedIn,
  loadInboxMessages,
  setLoadInboxMessages,
  loadOutboxMessages,
  setLoadOutboxMessages
}) => {
  const restorePath = localStorage.getItem('restorePath');
  const path = restorePath ?? '/PASS/clients';

  return (
    <Routes>
      <Route exact path="/PASS/" element={isLoggedIn ? <Navigate to={path} replace /> : <Home />} />
      <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
        <Route path="/PASS/clients" element={<Clients />} />
        <Route path="/PASS/forms" element={<Forms />} />
        <Route
          path="/PASS/inbox"
          element={
            <Inbox loadMessages={loadInboxMessages} setLoadMessages={setLoadInboxMessages} />
          }
        />
        <Route
          path="/PASS/outbox"
          element={
            <Outbox loadMessages={loadOutboxMessages} setLoadMessages={setLoadOutboxMessages} />
          }
        />
        <Route path="*" element={<Navigate to={restorePath} replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
