// React Imports
import React, { useState } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import ShareIcon from '@mui/icons-material/Share';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// Utility Imports
import { truncateText, getTypeText } from '@utils';

/**
 * @typedef {object} Document
 * @property {string} name - The given name of the document
 * @property {string} type - The given type of the document
 * @property {string} description - The given description of the document
 * @property {string} uploadDate- The upload date of the document
 * @property {string} endDate - The expiration date of the document
 * @property {string} fileUrl - The file URL of the document
 */

/**
 * DocumentCard - Component that contains a document
 *
 * @memberof Documents
 * @name DocumentCard
 * @param {object} Props - Component props for Document Preview
 * @param {Document} Props.document - The document
 * @param {Function} Props.onPreview - The document preview event
 * @param {Function} Props.onShare - The document share event
 * @param {Function} Props.onDelete - The document delete event
 * @returns {React.JSX.Element} React component for DocumentCard
 */
const DocumentCard = ({ document, onShare, onDelete, onPreview }) => {
  // primary columns
  // name, type, uploaddate, expiration, actions
  // expandable information
  //  description

  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const handleClick = (event, clickedDocument) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(clickedDocument.id);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenu(null);
  };

  const handleMenuItemClick = (action, clickedDocument) => () => {
    action(clickedDocument);
    handleClose();
  };

  const rowStyling = {
    display: 'flex',
    columnGap: '10px'
  };

  const columnStyling = {
    display: 'flex',
    flexDirection: 'column'
  };

  // styling for data contained in each section
  const dataStyling = {
    ...rowStyling,
    fontSize: '.8rem',
    justifyContent: 'flex-start'
  };

  // styling for each data section in the document data column
  const dataSectionStyling = {
    ...columnStyling,
    '& div': {
      ...dataStyling
    }
  };

  // styling for the document data column
  const dataColumnStyling = {
    ...columnStyling,
    flex: '1 1 90%',
    rowGap: '10px',
    '& div': {
      ...dataSectionStyling
    }
  };

  // styling for the document actions column
  const actionsColumnStyling = {
    ...columnStyling,
    flex: '0 1 10%',
    maxWidth: '54px',
    justifyContent: 'center',
    alignItems: 'flex-end'
  };

  const cardStyling = {
    ...rowStyling,
    background: theme.palette.background.tint,
    justifyContent: 'space-between',
    gap: '10px'
  };

  // icon styles
  const iconSize = {
    height: '24px',
    width: '24px'
  };

  const iconStyling = {
    width: '100%'
  };

  return (
    <Box>
      <Card
        sx={{
          my: '5px',
          position: 'relative'
        }}
      >
        <CardContent sx={cardStyling}>
          <Box sx={dataColumnStyling}>
            <Box>
              <Typography
                sx={{ fontSize: '1rem !important', fontWeight: 'bold' }}
                variant="body1"
                component="div"
                noWrap
              >
                {document.name || '[No Name provided]'}
              </Typography>
              <Typography
                sx={{ fontStyle: 'italic', fontWeight: 'bold' }}
                variant="body1"
                component="div"
                noWrap
              >
                {document.type ? getTypeText(document.type) : 'N/A'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" component="div" noWrap>
                {document.uploadDate
                  ? `Uploaded: ${document.uploadDate.toLocaleDateString()}`
                  : 'Upload Date Unset'}
              </Typography>
              <Typography variant="body1" component="div" noWrap>
                {document.endDate
                  ? `Expires: ${document.endDate.toLocaleDateString()}`
                  : 'Expiration Unset'}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontStyle: 'italic' }} variant="body1" component="div">
                {truncateText(document.description, 140)}
              </Typography>
            </Box>
          </Box>
          <Box sx={actionsColumnStyling}>
            <IconButton
              id="actions-icon-button"
              aria-controls={openMenu === document.id ? 'actions-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu === document.id ? 'true' : undefined}
              onClick={(event) => handleClick(event, document)}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </CardContent>
        <Menu
          id="actions-menu"
          anchorEl={anchorEl}
          open={openMenu === document.id}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'actions-icon-button'
          }}
        >
          <MenuItem
            component={Button}
            onClick={handleMenuItemClick(onPreview, document)}
            startIcon={<FileOpenIcon sx={iconSize} />}
            sx={iconStyling}
          >
            Preview
          </MenuItem>
          <MenuItem
            component={Button}
            onClick={handleMenuItemClick(onShare, document)}
            startIcon={<ShareIcon sx={iconSize} />}
            sx={iconStyling}
          >
            Share
          </MenuItem>
          <MenuItem
            component={Button}
            onClick={handleMenuItemClick(onDelete, document)}
            startIcon={<DeleteOutlineOutlinedIcon sx={iconSize} />}
            sx={iconStyling}
          >
            Delete
          </MenuItem>
        </Menu>
      </Card>
    </Box>
  );
};

export default DocumentCard;
