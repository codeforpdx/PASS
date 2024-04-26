// React Imports
import React, { useState, useEffect } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import WebcamModal from './WebcamModal';

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

const checkWebCamAvailability = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputDevices = devices.filter((device) => device.kind === 'videoinput');
    return videoInputDevices.length > 0;
  } catch (error) {
    // console.error("Error checking camera availability: ", error);
    return false;
  }
};

const dataURItoBlob = (dataURI) => {
  // Convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]);
  else byteString = unescape(dataURI.split(',')[1]);

  // Separate the mime component
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // Write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
};

const UploadButtonGroup = ({ file, setFile }) => {
  const [hasWebCam, sethasWebCam] = useState(false);

  useEffect(() => {
    const detectCamera = async () => {
      const isCameraAvailable = await checkWebCamAvailability();
      sethasWebCam(isCameraAvailable);
    };

    detectCamera();
  }, []);

  const [showWebcamModal, setShowWebcamModal] = useState(false);

  const handleCapture = (imageSrc) => {
    const now = new Date();
    const imageFilename = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(
      2,
      '0'
    )}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(
      2,
      '0'
    )}.jpg`;

    const imageBlob = dataURItoBlob(imageSrc);
    const imageFile = new File([imageBlob], imageFilename, { type: 'image/jpeg' });
    setFile(imageFile);
  };

  return (
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
        startIcon={<FileUploadOutlinedIcon />}
      >
        Upload File
        <input type="file" hidden accept=".pdf, .docx, .doc, .txt, .rtf" />
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
        startIcon={<InsertPhotoOutlinedIcon />}
      >
        Upload Photos
        <input type="file" hidden accept=".gif, .png, .jpeg, .jpg, .webp" />
      </Button>
      {hasWebCam ? (
        <Button
          variant={file ? 'outlined' : 'contained'}
          component="label"
          color="primary"
          onClick={() => setShowWebcamModal(true)}
          fullWidth
          startIcon={<PhotoCameraOutlinedIcon />}
          sx={{ borderRadius: '20px', marginLeft: '8px' }}
        >
          Take Photos
        </Button>
      ) : (
        <Button
          variant={file ? 'outlined' : 'contained'}
          component="label"
          color="primary"
          id="upload-doctype"
          name="uploadDoctype"
          onChange={(e) => setFile(e.target.files[0])}
          fullWidth
          required
          startIcon={<PhotoCameraOutlinedIcon />}
          sx={{ borderRadius: '20px', marginLeft: '8px' }}
        >
          Capture image
          <input type="file" hidden accept="image/*" capture="environment" />
        </Button>
      )}
      <WebcamModal
        open={showWebcamModal}
        onClose={() => setShowWebcamModal(false)}
        onCapture={handleCapture}
      />
    </Box>
  );
};
export default UploadButtonGroup;
