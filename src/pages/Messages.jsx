// React Imports
import React, { useContext, useState, useEffect } from 'react';
// Custom Hook Imports
import { useMessageList } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
// Context Imports
import { MessageContext } from '../contexts';
// Component Imports
import { NewMessageModal } from '../components/Modals';
import { MessageButtonGroup, MessageFolder } from '../components/Messages';

/**
 * Messages Page - Page that generates the components for the Message system
 * in PASS
 *
 * @memberof Pages
 * @name Messages
 * @returns {React.JSX.Element} The Messages Page
 */
const Messages = () => {
  localStorage.setItem('restorePath', '/messages');
  const { loadMessages, setLoadMessages, updateMessageCountState } = useContext(MessageContext);
  const { data: inboxList, refetch: refreshInbox } = useMessageList('Inbox');
  const { data: outboxList, refetch: refreshOutbox } = useMessageList('Outbox');

  // Handler function for refreshing PASS messages
  const handleMessageRefresh = async () => {
    setLoadMessages(true);
    await refreshInbox();
    await refreshOutbox();
    setLoadMessages(false);
  };

  // Renders Inbox and updates unread message count
  useEffect(() => {
    updateMessageCountState(inboxList?.reduce((a, m) => (!m.readStatus ? a + 1 : a), 0));
  }, [inboxList]);

  useEffect(() => {
    if (inboxList) setLoadMessages(false);
  }, [inboxList]);

  const [boxType, setBoxType] = useState('inbox');
  const [showModal, setShowModal] = useState(false);

  return (
    <Box sx={{ display: 'grid', gridTemplateRows: '80px 1fr' }}>
      <MessageButtonGroup
        showModal={showModal}
        setShowModal={setShowModal}
        boxType={boxType}
        setBoxType={setBoxType}
      />

      <MessageFolder
        folderType={boxType === 'inbox' ? 'Inbox' : 'Outbox'}
        handleRefresh={handleMessageRefresh}
        loadMessages={loadMessages}
        messageList={boxType === 'inbox' ? inboxList : outboxList}
      />
      {showModal && <NewMessageModal showModal={showModal} setShowModal={setShowModal} />}
    </Box>
  );
};

export default Messages;
