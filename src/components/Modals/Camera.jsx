// React Imports
import React, { useState } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';

const Camera = () => {
  const [startCamera, setStartCamera] = useState(false);
  const handleCamera = () => {
    setStartCamera(!startCamera);
    const video = document.getElementById('video');

    if (startCamera) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream) => {
        video.srcObject = stream;
        video.play();
      });
      return;
    }

    video.srcObject = null;
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <video id="video" style={{ border: '1px solid black', width: '320px', height: '240px' }} />
        <button type="button" onClick={handleCamera}>
          Start camera
        </button>
      </Box>
      <canvas id="canvas" style={{ width: '320px', height: '240px' }} />
      <div>
        <img id="photo" alt="The screen capture will appear in this box." />
      </div>
    </>
  );
};

export default Camera;
