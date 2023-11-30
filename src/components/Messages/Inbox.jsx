import React from 'react';
import { useMessageList } from '@hooks';
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
