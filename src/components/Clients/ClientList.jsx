// React Imports
import React, { useContext, useState } from 'react';
// Context Imports
import { UserListContext } from '../../contexts';
// Component Imports
import ClientListTable from './ClientListTable';
import DeleteClientModal from '../Modals/DeleteClientModal';
import { EmptyListNotification, LoadingAnimation } from '../Notification';

/**
 * ClientList Component - Component that generates ClientList section for PASS
 * which interfaces with Solid Pod to fetch user list
 *
 * @memberof Clients
 * @name ClientList
 * @returns {React.JSX.Element} The ClientList Component
 */
const ClientList = () => {
  const { userListObject } = useContext(UserListContext);
  const { loadingUsers } = useContext(UserListContext);

  // state for DeleteClientModal component
  const [showDeleteClientModal, setShowDeleteClientModal] = useState(false);

  // state for selected client to delete
  const [selectedClientToDelete, setSelectedClientToDelete] = useState(null);

  const determineClientListTable = userListObject.userList?.length ? (
    // render if clients
    <ClientListTable
      setSelectedClientToDelete={setSelectedClientToDelete}
      setShowDeleteClientModal={setShowDeleteClientModal}
    />
  ) : (
    // render if no clients
    <EmptyListNotification type="clients" />
  );

  // MAIN RETURN OF COMPONENT
  return loadingUsers ? (
    <LoadingAnimation loadingItem="clients" />
  ) : (
    <>
      {determineClientListTable}
      {/* modal/popup renders when showDeleteClientModal state is true */}
      <DeleteClientModal
        showDeleteClientModal={showDeleteClientModal}
        setShowDeleteClientModal={setShowDeleteClientModal}
        selectedClientToDelete={selectedClientToDelete}
      />
    </>
  );
};

export default ClientList;
