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
          folderType="Inbox"
          handleRefresh={handleMessageRefresh}
          loadMessages={loadMessages}
          messageList={inboxList}
        />
      ) : (
        <MessageFolder
          folderType="Outbox"
          handleRefresh={handleMessageRefresh}
          loadMessages={loadMessages}
          messageList={outboxList}
        />
      )}
    </>
  );
};

export default Messages;
