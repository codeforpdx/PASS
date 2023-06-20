// React Imports
import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// Inrupt Library Imports
import { useSession } from '@inrupt/solid-ui-react';
// Material UI Imports
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
// Utility Imports
import { getMessageTTL } from '../utils';
// Context Imports
import { MessageContext, SignedInUserContext } from '../contexts';
// Component Imports
import MessageFolder from '../components/Messages/MessageFolder';

const routesArray = [{ label: 'Inbox' }, { label: 'Outbox' }];

/**
 * Messages Page - Page that generates the components for the Message system
 * in PASS
 *
 * @memberof Pages
 * @name Messages
 * @returns {React.JSX.Element}
 */

const Messages = () => {
  const location = useLocation();

  localStorage.setItem('restorePath', location.pathname);

  const { podUrl } = useContext(SignedInUserContext);

  const { session } = useSession();
  const { inboxList, setInboxList, outboxList, setOutboxList, loadMessages, setLoadMessages } =
    useContext(MessageContext);

  // Handler function for refreshing PASS inbox
  const handleInboxRefresh = async () => {
    setLoadMessages(true);
    const messagesInSolid = await getMessageTTL(session, 'Inbox', inboxList, podUrl);
    messagesInSolid.sort((a, b) => b.uploadDate - a.uploadDate);
    setInboxList(messagesInSolid);
    setLoadMessages(false);
  };

  // Handler function for refreshing PASS outbox
  const handleOutboxRefresh = async () => {
    setLoadMessages(true);
    const messagesInSolid = await getMessageTTL(session, 'Outbox', outboxList, podUrl);
    messagesInSolid.sort((a, b) => b.uploadDate - a.uploadDate);
    setOutboxList(messagesInSolid);
    setLoadMessages(false);
  };

  // Re-sorts messages upon inboxList updating
  useEffect(() => {
    setLoadMessages(true);
    const inboxCopy = inboxList;
    inboxCopy.sort((a, b) => b.uploadDate - a.uploadDate);
    setInboxList(inboxCopy);
    setLoadMessages(false);
  }, [inboxList]);

  // Re-sorts messages upon outboxList updating
  useEffect(() => {
    setLoadMessages(true);
    const outboxCopy = outboxList;
    outboxCopy.sort((a, b) => b.uploadDate - a.uploadDate);
    setOutboxList(outboxCopy);
    setLoadMessages(false);
  }, [outboxList]);

  const [boxType, setBoxType] = useState('inbox');

  return (
    <>
      <Tabs value={boxType} sx={{ padding: '10px 30px' }}>
        {routesArray.map((item) => (
          <Tab
            key={`${item.label}Tab`}
            value={item.label.toLowerCase()}
            label={item.label}
            onClick={() => setBoxType(item.label.toLowerCase())}
          />
        ))}
      </Tabs>

      {boxType === 'inbox' ? (
        <MessageFolder
          folderType="inbox"
          handleRefresh={handleInboxRefresh}
          loadMessages={loadMessages}
          messageList={inboxList}
        />
      ) : (
        <MessageFolder
          folderType="outbox"
          handleRefresh={handleOutboxRefresh}
          loadMessages={loadMessages}
          messageList={outboxList}
        />
      )}
    </>
  );
};

export default Messages;
