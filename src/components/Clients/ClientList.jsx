// React Imports
import React, { useContext } from 'react';
// Context Imports
import { UserListContext } from '../../contexts';
// Component Imports
import ClientListTable from './ClientListTable';
import EmptyListNotification from '../Notification/EmptyListNotification';
import LoadingAnimation from '../Notification/LoadingAnimation';

/**
 * ClientList Component - Component that generates ClientList section for PASS
 * which interfaces with Solid Pod to fetch user list
 *
 * @memberof Clients
 * @name ClientList
 */

const ClientList = () => {
  const { userListObject } = useContext(UserListContext);
  const { loadingUsers } = useContext(UserListContext);

  const determineClientListTable = userListObject.userList?.length ? (
    // render if clients
    <ClientListTable statusType="Status" defaultMessage="No actions performed" />
  ) : (
    // render if no clients
    <EmptyListNotification type="clients" />
  );

  // MAIN RETURN OF COMPONENT
  return loadingUsers ? <LoadingAnimation loadingItem="clients" /> : determineClientListTable;
};

export default ClientList;
