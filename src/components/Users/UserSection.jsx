import React from 'react';
import { ManageUsers } from '../Form';
import UsersList from './UsersList';

/**
 * Users Component - Component that generates Users section for PASS
 *
 * @memberof GlobalComponents
 * @name UserSection
 */

const UserSection = () => (
  <>
    <ManageUsers />
    <UsersList />
  </>
);

export default UserSection;
