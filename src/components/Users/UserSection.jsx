import React from 'react';
import { ManageUsers } from '../Form';
import UsersList from './UsersList';
import { Logout } from '../Login';

/**
 * Users Component - Component that generates Users section for PASS
 *
 * @memberof GlobalComponents
 * @name UserSection
 */

const UserSection = ({ loadingUsers }) => (
  <>
    <Logout />
    <ManageUsers />
    {loadingUsers ? (
      <UsersList />
    ) : (
      <section className="panel">
        <strong>Users List</strong>
        <br />
        <br />
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>Loading users list...</div>
      </section>
    )}
  </>
);

export default UserSection;
