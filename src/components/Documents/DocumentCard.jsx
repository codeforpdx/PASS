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

// Utility Imports
import { truncateText } from '@utils';

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

  const getTypeText = (type) => {
    switch (type) {
      case 'driversLicense':
        return "Driver's License";
      case 'passport':
        return 'Passport';
      case 'bankStatement':
        return 'Bank Statement';
      default:
        return 'Unknown Document Type';
    }
  };

  // styling for primary, top-level information
  const primaryRowStyling = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  // styling for primary, top-level information
  const secondaryRowStyling = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    columnGap: '10px',
    flexWrap: 'wrap'
  };

  // styling for secondary information
  const descriptionRowStyling = {
    marginTop: '10px'
  };

  // ubiquitous information styling
  const primaryColumnStyling = {
    columnGap: '10px'
  };

  const secondaryColumnStyling = {
    fontSize: '0.8rem',
    color: 'text.secondary',
    fontWeight: 'bold'
  };

  // secondary information styling
  const descriptionColumnStyling = {
    fontSize: '0.875rem',
    wordWrap: 'break-word',
    color: 'text.secondary',
    fontStyle: 'italic'
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
        <CardContent>
          <Box sx={primaryRowStyling}>
            <Typography
              variant="body1"
              component="div"
              noWrap
              sx={{ ...primaryColumnStyling, marginLeft: '0' }}
            >
              {document.name || '[No Name provided]'}
            </Typography>
            <Typography variant="body1" component="div" noWrap sx={primaryColumnStyling}>
              {document.type ? getTypeText(document.type) : 'N/A'}
            </Typography>

            <Box
              sx={{
                ...primaryColumnStyling,
                justifyContent: 'flex-end',
                maxWidth: '54px',
                marginRight: '0'
              }}
            >
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
          </Box>
          <Box sx={secondaryRowStyling}>
            <Typography variant="body1" component="div" noWrap sx={secondaryColumnStyling}>
              {document.uploadDate
                ? `Uploaded ${document.uploadDate.toLocaleDateString()}`
                : 'Unknown Upload Date'}
            </Typography>
            <Typography
              variant="body1"
              component="div"
              noWrap
              sx={{ ...secondaryColumnStyling, justifyContent: 'flex-end', paddingRight: '18px' }}
            >
              {document.endDate
                ? `Expires ${document.endDate.toLocaleDateString()}`
                : 'No Expiration'}
            </Typography>
          </Box>
          <Box sx={descriptionRowStyling}>
            <Typography variant="body1" component="div" sx={descriptionColumnStyling}>
              {truncateText(document.description, 140)}
            </Typography>
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
