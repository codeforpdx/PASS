// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

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
 * @returns {React.JSX.Element} React component for DocumentPreview
 */
const DocumentPreview = ({ document }) => {
  /**
   * @todo: Import document utilities from
   * @file DocumentListContext.jsx
   * @file DocumentList.js
   */

  /**  @todo: Implement buttons */
  const handleShare = async () => {
    try {
      // await shareDocument(document);
    } catch {
      throw new Error('Failed to update read status');
    }
  };

  const handleReplace = async () => {
    try {
      // await replaceDocument(document);
    } catch {
      throw new Error('Failed to update read status');
    }
  };

  const handleRemove = async () => {
    try {
      // await removeDocument(document);
    } catch {
      throw new Error('Failed to update read status');
    }
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
    }
  ];

  /** 
   * DOCUMENT INFO
   * ------------------
    id: document.name,
    type: document.type,
    name: document.name,
    description: document.description,
    delete: document,
    'upload date': document?.uploadDate.toLocaleDateString(),
    'expiration date': document?.endDate?.toLocaleDateString(),
    'preview file': document.fileUrl
   */

  return (
    <Container sx={{ wordWrap: 'break-word' }}>
      <Paper>
        <Box sx={{ flexGrow: 1 }}>
          <ListItemButton
            onClick={
              /** @todo: Implement viewDocument page */ alert('TODO: Implement viewDocument')
            }
            alignItems="flex-start"
            aria-label={`open document preview ${document.id}`}
          >
            <Grid container columnSpacing={1} sx={{ padding: isSmallScreen ? '0' : '10px' }}>
              {documentInfo.map((info, index) => (
                <Grid
                  item
                  xs={info.xs_value}
                  sx={{ opacity: '1' }}
                  key={info.title + String(index)}
                >
                  <Typography>
                    {info.title} <strong>{info.text}</strong>
                  </Typography>
                </Grid>
              ))}

              <Grid item xs={12}>
                <Divider />
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={handleShare}>
                    Share
                  </Button>
                  <Button variant="outlined" onClick={handleReplace}>
                    Replace
                  </Button>
                  <Button variant="outlined" onClick={handleRemove}>
                    Remove
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </ListItemButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default DocumentPreview;
