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

const UserSection = () => (
  <>
    <Logout />
    <ManageUsers />
    <UsersList />
  </>
);

export default UserSection;
