// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SearchIcon from '@mui/icons-material/Search';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

/**
 * The UploadButtonGroup Component is a component that renders the upload document
 * buttons and renders a capture image button when screen width is below 768px
 *
 * @memberof Modals
 * @name UploadButtonGroup
 * @param {object} Props - The props for UploadButtonGroup Component
 * @param {File} Props.file - The selected file
 * @param {Function} Props.setFile - The set function for handling files
 * @returns {React.JSX.Element} - The UploadButtonGroup Component
 */
const UploadButtonGroup = ({ file, setFile }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isCustomMediumScreen = useMediaQuery('(max-width: 768px)');

  return (
    <Box
      sx={{
        display: 'flex',
        padding: '8px 8px 0',
        flexDirection: isSmallScreen ? 'column' : 'row',
        gap: isSmallScreen ? '10px' : '8px',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Button
        variant={file ? 'outlined' : 'contained'}
        component="label"
        color="primary"
        id="upload-doctype"
        name="uploadDoctype"
        onChange={(e) => setFile(e.target.files[0])}
        fullWidth
        required
        startIcon={<SearchIcon />}
      >
        Choose file
        <input
          type="file"
          hidden
          accept=".pdf, .docx, .doc, .txt, .rtf, .gif, .png, .jpeg, .jpg, .webp"
        />
      </Button>
      {isCustomMediumScreen && (
        <Button
          variant={file ? 'outlined' : 'contained'}
          component="label"
          color="primary"
          id="upload-doctype"
          name="uploadDoctype"
          onChange={(e) => setFile(e.target.files[0])}
          fullWidth
          required
          startIcon={<PhotoCameraIcon />}
        >
          Capture image
          <input type="file" hidden accept="image/*" capture="environment" />
        </Button>
      )}
    </Box>
  );
};

export default UploadButtonGroup;
