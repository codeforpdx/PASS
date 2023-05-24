// React imports
import React from 'react';

/**
 * Message Preview Component - Component that displays message previews from
 * user's Inbox container
 *
 * @memberof Inbox
 * @name MessagePreview
 */

const MessagePreview = ({ message }) => {
  <div>
    <h1>{message.title}</h1>
    <h2>{message.author}</h2>
    <p>{message.contents}</p>
  </div>;
};

export default MessagePreview;
