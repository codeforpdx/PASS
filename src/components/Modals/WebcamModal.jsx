import React, { useRef } from 'react';
import Webcam from 'react-webcam';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

// TODO: Determine future of this modal
// web camera modal
const WebcamModal = ({ open, onClose, onCapture }) => {
  const webcamRef = useRef(null);

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="webcam-modal-title"
      aria-describedby="webcam-modal-description"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh'
        }}
      >
        <h2 id="webcam-modal-title">Webcam</h2>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: 'user' }}
        />
        <Button variant="contained" color="primary" onClick={handleCapture}>
          Take Photo
        </Button>
      </div>
    </Modal>
  );
};

export default WebcamModal;
