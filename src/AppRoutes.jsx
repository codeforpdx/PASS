// React Imports
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// Page Imports
import UserSection from './routes/UserSection';
import Inbox from './routes/Inbox';
import Forms from './routes/Forms';

const AppRoutes = ({ loadingActive, loadMessages }) => {
  const restorePath = localStorage.getItem('restorePath');
  const path = restorePath ?? '/PASS/home';

  return (
    <Routes>
      <Route exact path="/PASS/" element={<Navigate to={path} replace />} />
      <Route path="/PASS/home" element={<UserSection loadingActive={loadingActive} />} />
      <Route path="/PASS/forms" element={<Forms />} />
      <Route path="/PASS/inbox" element={<Inbox loadMessages={loadMessages} />} />
      <Route path="*" element={<Navigate to={restorePath} replace />} />
    </Routes>
  );
};

export default AppRoutes;
