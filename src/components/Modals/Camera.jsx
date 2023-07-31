// React Imports
import React, { useState } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';

const Camera = () => {
  const [startCamera, setStartCamera] = useState(false);
  const video = document.getElementById('video');

  const handleStartCamera = () => {
    setStartCamera(true);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch((error) => {
        console.log(`Error accessing camera, ${error}`);
      });
  };

  const handleStopCamera = () => {
    setStartCamera(false);

    const tracks = video.srcObject?.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    video.srcObject = null;
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <video id="video" style={{ border: '1px solid black', width: '320px', height: '240px' }} />
        {startCamera ? (
          <button type="button" onClick={handleStopCamera}>
            Stop camera
          </button>
        ) : (
          <button type="button" onClick={handleStartCamera}>
            Start camera
          </button>
        )}
      </Box>
      <canvas id="canvas" style={{ width: '320px', height: '240px' }} />
      <div>
        <img id="photo" alt="The screen capture will appear in this box." />
      </div>
    </>
  );
};

export default Camera;
