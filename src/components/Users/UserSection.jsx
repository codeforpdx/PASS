import React from 'react';
import { useLocation } from 'react-router-dom';
import { ManageUsers } from '../Form';
import UsersList from './UsersList';
import { Logout } from '../Login';
import NavBar from '../NavBar/NavBar';
import { InactivityMessage } from '../Notification';

/**
 * Users Component - Component that generates Users section for PASS
 *
 * @memberof GlobalComponents
 * @name UserSection
 */

const UserSection = ({ loadingUsers, loadingActive }) => {
  const location = useLocation();

  localStorage.setItem('restorePath', location.pathname);

  return (
    <>
      <NavBar />
      <Logout />
      <ManageUsers />
      {loadingUsers ? (
        <UsersList loadingActive={loadingActive} />
      ) : (
        <section className="panel">
          <strong>Users List</strong>
          <br />
          <br />
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>Loading users list...</div>
        </section>
      )}
      <InactivityMessage />
    </>
  );
};

export default UserSection;
