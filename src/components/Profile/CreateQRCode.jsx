import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography
} from '@mui/material';

/**
 *
 * @param root0
 * @param root0.webId
 */

const CreateQRCode = ({ webId }) => {
  const [qrIconClicked, setQrIconClicked] = useState(false);
  const [docUrl, setDocUrl] = useState(null);

  const createQrCode = () => {
    setQrIconClicked(!qrIconClicked);
    const trimmedWebId = webId && webId.includes('#') ? webId.split('#')[0] : webId;
    setDocUrl(trimmedWebId);
  };

  const closeModal = () => {
    setQrIconClicked(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<QrCode2Icon />}
        onClick={() => {
          createQrCode();
        }}
      >
        Show QR Code
      </Button>
      {qrIconClicked ? (
        <Dialog
          open={qrIconClicked}
          onClose={closeModal}
          aria-labelledby="qr-modal-title"
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle id="qr-modal-title" sx={{ textAlign: 'center' }}>
            Share your WebID
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} alignItems="center" sx={{ py: 1 }}>
              <div style={{ background: '#fff' }}>
                <div style={{ width: 256 }}>
                  <QRCode
                    value={docUrl || ''}
                    size={256}
                    style={{ width: '100%', height: 'auto' }}
                    viewBox="0 0 256 256"
                    level="M"
                  />
                </div>
              </div>
              <Typography variant="body2" sx={{ wordBreak: 'break-all', textAlign: 'center' }}>
                {docUrl}
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button
              onClick={closeModal}
              variant="contained"
              sx={{
                width: { xs: '90%', sm: '75%' }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        ''
      )}
    </>
  );
};

export default CreateQRCode;
