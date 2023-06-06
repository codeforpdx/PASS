// React Imports
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSession } from '@inrupt/solid-ui-react';
// Page Imports
import LandingPage from './routes/LandingPage';
import UserSection from './routes/UserSection';
import Inbox from './routes/Inbox';
import Forms from './routes/Forms';

const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/PASS/landing" replace />;
  }
  return children;
};

const AppRoutes = () => {
  const restorePath = localStorage.getItem('restorePath');
  const path = restorePath ?? '/PASS/home';
  const { isLoggedIn } = useSession().session.info

  return (
    <Routes>
      <Route exact path="/PASS/" element={<Navigate to={path} replace />} />
      <Route path="/PASS/landing" element={<LandingPage />} />
      <Route element={<ProtectedRoute isLoggedIn={isLoggedIn}/>} >
        <Route path="/PASS/home" element={<UserSection />} />
        <Route path="/PASS/forms" element={<Forms />} />
        <Route path="/PASS/inbox" element={<Inbox />} />
      </Route>
      <Route path="*" element={<Navigate to='/PASS/home' replace />} />
    </Routes>
  );
};

export default AppRoutes;
