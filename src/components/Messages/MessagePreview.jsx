// React imports
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

  const handleClick = () => {
    setShowContents(!showContents);
  };

  const handleReplyMessage = () => {
    setShowModal(!showModal);
  };

  return (
    <Container sx={{ wordWrap: 'break-word' }}>
      <Paper>
        <Box
          sx={{
            flexGrow: 1
          }}
        >
          <ListItemButton onClick={() => handleClick()} alignItems="flex-start">
            <Grid
              container
              rowSpacing={1}
              // columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{ padding: '10px' }}
            >
              <Grid
                item
                xs={5}
                // md={5}
              >
                <Typography>
                  <b>Sender:</b> {message.sender}
                </Typography>
              </Grid>
              <Grid
                item
                xs={5}
                // md={5}
              >
                <Typography>
                  <b>Subject:</b> {message.title}
                </Typography>
              </Grid>
              <Grid
                item
                xs={2}
                // md={2}
              >
                <Typography>
                  <b>Date:</b> {message.uploadDate.toLocaleDateString()}
                </Typography>
              </Grid>

              {showContents && (
                <>
                  <Grid item xs={12}>
                    <Divider />
                    {message.message.split('\n').map((line, index) => (
                      <Typography
                        sx={
                          {
                            // maxWidth: '80vw',
                            // paddingTop: '10px'
                          }
                        }
                        key={line + String(index)}
                      >
                        {line}
                      </Typography>
                    ))}
                  </Grid>
                  <Grid item xs={12}>
                    {showContents && folderType === 'Inbox' && (
                      <Button variant="contained" type="button" onClick={handleReplyMessage}>
                        Reply
                      </Button>
                    )}
                  </Grid>
                </>
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
