// React Imports
import React, { useContext, useState } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// Custom Hook Imports
import { useSession } from '@hooks';
// Utility Imports
import { updateMessageReadStatus, getMessageTTL } from '@utils';
// Context Imports
import { MessageContext, SignedInUserContext } from '@contexts';
// Component Imports
import { NewMessageModal } from '../Modals';

/**
 * @typedef {import("../../typedefs.js").messagePreviewProps} messagePreviewProps
 */

/**
 * Message Preview Component - Component that displays message previews from
 * user's Inbox container
 *
 * @memberof Messages
 * @name MessagePreview
 * @param {messagePreviewProps} Props - Component props for MessagePreview
 * @returns {React.JSX.Element} React component for MessagePreview
 */
const MessagePreview = ({ message, folderType }) => {
  const [showContents, setShowContents] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { session } = useSession();
  const { podUrl } = useContext(SignedInUserContext);
  const { inboxList, setInboxList } = useContext(MessageContext);

  const handleClick = async () => {
    setShowContents(!showContents);
    if (folderType === 'Inbox') {
      try {
        await updateMessageReadStatus(session, message);
        const messagesInSolid = await getMessageTTL(session, folderType, inboxList, podUrl);
        messagesInSolid.sort((a, b) => b.uploadDate - a.uploadDate);
        setInboxList(messagesInSolid);
      } catch {
        throw new Error('Failed to update read status');
      }
    }
  };

  const handleReplyMessage = () => {
    setShowModal(!showModal);
  };

  const messageInfo = [
    { title: 'Sender: ', text: message.sender, xs_value: 3 },
    { title: 'Subject: ', text: message.title, xs_value: 7 },
    { title: 'Date: ', text: message.uploadDate.toLocaleDateString(), xs_value: 2 }
  ];

  return (
    <Container sx={{ wordWrap: 'break-word' }}>
      <Paper>
        <Box sx={{ flexGrow: 1 }}>
          <ListItemButton onClick={() => handleClick()} alignItems="flex-start">
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{ padding: '10px' }}
            >
              {messageInfo.map((info, index) => (
                <Grid
                  item
                  xs={info.xs_value}
                  sx={{ opacity: message.readStatus ? '0.5' : '1' }}
                  key={info.title + String(index)}
                >
                  <Typography>
                    {info.title} <strong>{info.text}</strong>
                  </Typography>
                </Grid>
              ))}

              {showContents && (
                <Grid item xs={12}>
                  <Divider />
                  {message.message.split('\n').map((line, index) => (
                    <Typography sx={{ padding: '10px 5px' }} key={line + String(index)}>
                      {line}
                    </Typography>
                  ))}
                  {showContents && folderType === 'Inbox' && (
                    <Button variant="contained" type="button" onClick={handleReplyMessage}>
                      Reply
                    </Button>
                  )}
                </Grid>
              )}
            </Grid>

            {showModal && (
              <NewMessageModal
                showModal={showModal}
                setShowModal={setShowModal}
                oldMessage={message}
              />
            )}
          </ListItemButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default MessagePreview;
