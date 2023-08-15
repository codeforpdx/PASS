// React imports
import React, { useState } from 'react';
// Material UI Imports
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
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
        <Box sx={{ flexGrow: 1 }}>
          <ListItemButton onClick={() => handleClick()} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Placeholder" src="" />
            </ListItemAvatar>

            <Grid container spacing={2}>
              <Grid item xs={6} md={4}>
                <Typography>{message.uploadDate.toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={6} md={8}>
                <Typography>
                  {message.sender} - {message.title}
                </Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid
                item
                xs={6}
                md={8}
              >
                {showContents && (
                  <>
                    <Divider />
                    <Typography>Content:</Typography>
                    <Box>
                      {message.message.split('\n').map((line, index) => (
                        <Typography sx={{ wordWrap: 'break-word' }} key={line + String(index)}>
                          {line}
                        </Typography>
                      ))}
                    </Box>
                  </>
                )}
              </Grid>
              <Grid item xs={6} md={4}>
                {showContents && folderType === 'Inbox' && (
                  <Button variant="contained" type="button" onClick={handleReplyMessage}>
                    Reply
                  </Button>
                )}
              </Grid>
            </Grid>
          </ListItemButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default MessagePreview;
