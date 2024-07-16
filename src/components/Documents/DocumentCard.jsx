// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ShareIcon from '@mui/icons-material/Share';
import FileOpenIcon from '@mui/icons-material/FileOpen';

/**
 * @typedef {import("../../typedefs.js").DocumentListContext} documentListObject //@todo Update this
 */

/**
 * DocumentPreview - Component that displays document previews from
 * user's documents container
 *
 * @memberof Documents
 * @name DocumentPreview
 * @param {object} Props - Component props for Document Preview
 * @param {documentListObject} Props.document - The document object
 * @param {object} Props.handlers - Object containing pertinent event handlers
 * @param {EventListener} Props.handlers.onPreview - The document preview event
 * @param Props.onShare
 * @param Props.onDelete
 * @param Props.onPreview
 * @param {EventListener} Props.handlers.onShare - The document share event
 * @param {EventListener} Props.handlers.onDelete - The document delete event
 * @returns {React.JSX.Element} React component for DocumentPreview
 */
const DocumentCard = ({ document, onShare, onDelete, onPreview }) => {
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

  const documentInfo = [
    {
      title: 'Name: ',
      text: document?.name,
      xs_value: isSmallScreen ? 12 : renderMediumGridLeft()
    },
    {
      title: 'Type: ',
      text: document?.type,
      xs_value: isSmallScreen ? 12 : renderMediumGridLeft()
    },
    {
      title: 'Description: ',
      text: document?.description,
      xs_value: isSmallScreen ? 12 : renderMediumGridRight()
    },
    {
      title: 'Upload Date: ',
      text: document?.uploadDate.toLocaleDateString(),
      xs_value: isSmallScreen ? 12 : renderMediumGridLeft()
    },
    {
      title: 'Expiration Date: ',
      text: document?.endDate?.toLocaleDateString(),
      xs_value: isSmallScreen ? 12 : renderMediumGridLeft()
    }
  ];

  return (
    <Container sx={{ wordWrap: 'break-word' }}>
      <Paper>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container columnSpacing={1} sx={{ padding: isSmallScreen ? '0' : '10px' }}>
            {documentInfo.map((info, index) => (
              <Grid item xs={info.xs_value} sx={{ opacity: '1' }} key={info.title + String(index)}>
                <Typography>
                  {info.title} <strong>{info.text}</strong>
                </Typography>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Divider />
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={() => onShare()}>
                  <img src={ShareIcon} alt="share" />
                </Button>
                <Button variant="outlined" onClick={() => onDelete()}>
                  <img src={DeleteOutlineOutlinedIcon} alt="delete" />
                </Button>
                <Button variant="outlined" onClick={() => onPreview()}>
                  <img src={FileOpenIcon} alt="preview" />
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default DocumentCard;
