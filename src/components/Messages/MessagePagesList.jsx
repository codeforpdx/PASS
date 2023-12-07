import React from 'react';
import { Messages } from '@pages';
import Inbox from './Inbox';
import Outbox from './Outbox';

const MESSAGE_PAGES_LIST = [
  { path: '/messages', element: <Messages /> },
  { path: '/messages/inbox', element: <Inbox /> },
  { path: '/messages/outbox', element: <Outbox /> }
];

export default MESSAGE_PAGES_LIST;
