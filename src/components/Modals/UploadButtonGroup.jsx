// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SearchIcon from '@mui/icons-material/Search';

const UploadButtonGroup = ({ file, setFile }) => (
  <Box sx={{ display: 'flex', padding: '8px 8px 0', boxSizing: 'border-box' }}>
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
      sx={{ borderRadius: '20px' }}
    >
      Choose file
      <input
        type="file"
        hidden
        accept=".pdf, .docx, .doc, .txt, .rtf, .gif, .png, .jpeg, .jpg, .webp"
      />
    </Button>
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
      sx={{ borderRadius: '20px', marginLeft: '8px' }}
    >
      Capture image
      <input type="file" hidden accept="image/*" capture="environment" />
    </Button>
  </Box>
);

export default UploadButtonGroup;
