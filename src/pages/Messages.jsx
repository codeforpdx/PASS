// React Imports
import React, { useContext, useState, useEffect } from 'react';
// Custom Hook Imports
import { useSession } from '@hooks';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CreateIcon from '@mui/icons-material/Create';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
// Utility Imports
import { getMessageTTL } from '../utils';
// Context Imports
import { MessageContext, SignedInUserContext } from '../contexts';
// Component Imports
import { NewMessageModal } from '../components/Modals';
import { MessageFolder } from '../components/Messages';

const routesArray = [{ label: 'Inbox' }, { label: 'Outbox' }];

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
      <Box sx={{ display: 'flex', padding: '20px 30px 10px' }}>
        <Button
          variant="contained"
          onClick={() => setShowModal(!showModal)}
          startIcon={<CreateIcon />}
          color="secondary"
        >
          New Message
        </Button>
        <Tabs value={boxType} sx={{ padding: '0 15px' }}>
          {routesArray.map((item) => (
            <Tab
              key={`${item.label}Tab`}
              value={item.label.toLowerCase()}
              label={item.label}
              onClick={() => setBoxType(item.label.toLowerCase())}
            />
          ))}
        </Tabs>
      </Box>

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
