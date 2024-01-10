// React Imporst
import React from 'react';
// Custom Hooks Imports
import { useMessageList } from '@hooks';
// Component Imports
import MessageFolder from './MessageFolder';

const Outbox = () => {
  localStorage.setItem('restorePath', '/messages/outbox');
  const { data, refetch, isFetching } = useMessageList('Outbox');

  return (
    <MessageFolder
      folderType="Outbox"
      handleRefresh={refetch}
      loadMessages={isFetching}
      messageList={data}
    />
  );
};

export default Outbox;
