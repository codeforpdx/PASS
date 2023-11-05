// React Imports
import React, { useContext, useState, useEffect } from 'react';
// Custom Hook Imports
import { useSession } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
// Utility Imports
import { getMessageTTL } from '../utils';
// Context Imports
import { MessageContext, SignedInUserContext } from '../contexts';
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
  const { podUrl } = useContext(SignedInUserContext);
  const { session } = useSession();
  const {
    inboxList,
    setInboxList,
    outboxList,
    setOutboxList,
    loadMessages,
    setLoadMessages,
    updateMessageCountState
  } = useContext(MessageContext);

  // Handler function for refreshing PASS messages
  const handleMessageRefresh = async (folderType) => {
    setLoadMessages(true);
    const messageList = folderType === 'Inbox' ? inboxList : outboxList;
    const messagesInSolid = await getMessageTTL(session, folderType, messageList, podUrl);
    messagesInSolid.sort((a, b) => b.uploadDate - a.uploadDate);
    if (folderType === 'Inbox') {
      setInboxList(messagesInSolid);
    } else {
      setOutboxList(messagesInSolid);
    }
    setLoadMessages(false);
  };

  // Re-sorts inbox messages upon updates
  useEffect(() => {
    setLoadMessages(true);
    let inboxCopy = inboxList;
    inboxCopy = inboxCopy.sort((a, b) => b.uploadDate - a.uploadDate);
    updateMessageCountState(inboxList.reduce((a, m) => (!m.readStatus ? a + 1 : a), 0));
    setInboxList(inboxCopy);
    setLoadMessages(false);
  }, [inboxList]);

  // Re-sorts outbox messages upon updates
  useEffect(() => {
    setLoadMessages(true);
    let outboxCopy = outboxList;
    outboxCopy = outboxCopy.sort((a, b) => b.uploadDate - a.uploadDate);
    setOutboxList(outboxCopy);
    setLoadMessages(false);
  }, [outboxList]);

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
