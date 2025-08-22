import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import QrCode2Icon from '@mui/icons-material/QrCode2';
// import Box from '@mui/material/Box';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { useTheme } from '@mui/material/styles';

/**
 *
 * @param root0
 * @param root0.webId
 */
const CreateQRCode = ({ webId }) => {
  console.log('WebId: ', webId);
  const [qrIconClicked, setQrIconClicked] = useState(false);

  const createQrCode = () => {
    setQrIconClicked(!qrIconClicked);
  };

  return (
    <IconButton
      aria-label="Create QR Code"
      edge="end"
      onClick={() => {
        createQrCode();
      }}
    >
      <QrCode2Icon />
      {qrIconClicked ? (
        <div style={{ height: 'auto', margin: '0 auto', maxWidth: 64, width: '100%' }}>
          <QRCode
            size={256}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            value={webId}
            viewBox="0 0 256 256"
          />
        </div>
      ) : (
        ''
      )}
    </IconButton>
  );
};

export default CreateQRCode;
