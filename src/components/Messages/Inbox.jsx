// React Imports
import React from 'react';
// Custom Hooks Imports
import { useMessageList } from '@hooks';
// Component Imports
import MessageFolder from './MessageFolder';

const Inbox = () => {
  localStorage.setItem('restorePath', '/messages/inbox');
  const { data, refetch, isFetching } = useMessageList('Inbox');

  return (
    <MessageFolder
      folderType="Inbox"
      handleRefresh={refetch}
      loadMessages={isFetching}
      messageList={data}
    />
  );
};

export default Inbox;
