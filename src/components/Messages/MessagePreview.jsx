// React Imports
import React, { useState } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// Custom Hook Imports
import { useMessageList, useSession } from '@hooks';
// Utility Imports
import { updateMessageReadStatus } from '@utils';
// Component Imports
import { NewMessageModal } from '../Modals';

/**
 * @typedef {import("../../typedefs.js").messageListObject} messageListObject
 */

/**
 * Message Preview Component - Component that displays message previews from
 * user's Inbox container
 *
 * @memberof Messages
 * @name MessagePreview
 * @param {object} Props - Component props for MessagePreview
 * @param {messageListObject} Props.message - The message object
 * @param {string} Props.folderType - Type of message box
 * @returns {React.JSX.Element} React component for MessagePreview
 */
const MessagePreview = ({ message, folderType }) => {
  const [showContents, setShowContents] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { session } = useSession();
  const { refetch: refreshInbox } = useMessageList('Inbox');

  const handleClick = async () => {
    setShowContents(!showContents);
    if (folderType === 'Inbox') {
      try {
        await updateMessageReadStatus(session, message);
        if (!message.readStatus) {
          await refreshInbox();
        }
      } catch {
        throw new Error('Failed to update read status');
      }
    }
  };

  const handleReplyMessage = () => {
    setShowModal(!showModal);
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const renderMediumGridLeft = () => {
    if (isMediumScreen) return 8;
    return 5;
  };

  const renderMediumGridRight = () => {
    if (isMediumScreen) return 4;
    return 2;
  };

  const messageInfo = [
    {
      title: 'Sender: ',
      text: message?.sender,
      xs_value: isSmallScreen ? 12 : renderMediumGridLeft()
    },
    {
      title: 'Subject: ',
      text: message?.title,
      xs_value: isSmallScreen ? 12 : renderMediumGridLeft()
    },
    {
      title: 'Date: ',
      text: message?.uploadDate?.toLocaleDateString(),
      xs_value: isSmallScreen ? 12 : renderMediumGridRight()
    }
  ];

  return (
    <>
      <Container sx={{ wordWrap: 'break-word' }}>
        <Paper>
          <Box sx={{ flexGrow: 1 }}>
            <ListItemButton
              onClick={() => handleClick()}
              alignItems="flex-start"
              aria-label={`open message preview ${message.messageId}`}
            >
              <Grid container columnSpacing={1} sx={{ padding: isSmallScreen ? '0' : '10px' }}>
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
            </ListItemButton>
          </Box>
        </Paper>
      </Container>
      {showModal && (
        <NewMessageModal showModal={showModal} setShowModal={setShowModal} oldMessage={message} />
      )}
    </>
  );
};

export default MessagePreview;
