// React Imports
import React, { useEffect } from 'react';
// Custom Hooks Imports
import { useMessageList } from '@hooks';
// Component Imports
import MessageFolder from './MessageFolder';

const Inbox = () => {
  useEffect(() => {
    localStorage.setItem('restorePath', '/messages/inbox');
  }, []);
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
