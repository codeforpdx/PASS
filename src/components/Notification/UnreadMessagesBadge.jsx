import React, { useState } from 'react';
import { Badge } from '@mui/material/Badge';
import { ReactComponent as MessageIcon } from './message-icon.svg';

const UnreadMessagesBadge = ({ messages }) => {
  const [unreadMessages, setUnreadMessages] = useState(0);

  React.useEffect(() => {
    const unreadMessagesCount = messages.filter((message) => !message.read).length;
    setUnreadMessages(unreadMessagesCount);
  }, [messages]);

  if (unreadMessages === 0) {
    return null;
  }

  return (
    <Badge badgeContent={unreadMessages} color="primary">
      <MessageIcon />
    </Badge>
  );
};

export default UnreadMessagesBadge;
