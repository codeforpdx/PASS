// React Imports
import React, { useState } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PreviewIcon from '@mui/icons-material/Preview';
import ShareIcon from '@mui/icons-material/Share';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Typography from '@mui/material/Typography';

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

  const iconSize = {
    height: '24px',
    width: '24px'
  };

  const iconStyling = {
    width: '100%'
  };

  return (
    <Box key={document.id}>
      <Card
        sx={{
          my: '5px',
          position: 'relative'
        }}
      >
        <CardContent>
          <Box>
            <Typography variant="body1" component="div" noWrap sx={{ maxWidth: '90%' }}>
              {document.name || '[No name given]'}
            </Typography>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                right: 5,
                transform: 'translateY(-50%)'
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
            startIcon={<PreviewIcon sx={iconSize} />}
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
