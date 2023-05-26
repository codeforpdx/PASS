import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';
import { SOLID_IDENTITY_PROVIDER } from '../../utils';

const textFieldStyle = {
  margin: '8px'
};

const renderWebId = (username) => {
  const oidcProvider = SOLID_IDENTITY_PROVIDER.split('//')[1];
  const template = ['https://', `.${oidcProvider}profile/card#me`];
  return `${template[0]}${username}${template[1]}`;
};

const WebIdEditButton = ({ lockStatus, setLockStatus }) => (
  <IconButton
    onClick={(e) => {
      e.preventDefault();
      setLockStatus(!lockStatus);
    }}
  >
    {lockStatus ? <LockOpen /> : <Lock />}
  </IconButton>
);

const ManualWebIdForm = ({ webId, setWebId, username, setUsername }) => {
  const [userEditingWebId, setUserEditingWebId] = useState(false);

  const wrappedSetUsername = (value) => {
    setUsername(value);
    if (userEditingWebId) {
      return;
    }
    const renderedWebId = renderWebId(value);
    setWebId(renderedWebId);
  };

  return (
    <>
      <TextField
        style={textFieldStyle}
        id="username-form"
        label="Username"
        aria-label="Username"
        variant="outlined"
        type="text"
        value={username}
        onChange={(e) => wrappedSetUsername(e.target.value)}
      />
      <br />
      <TextField
        fullWidth
        style={textFieldStyle}
        id="webId"
        label="WebId"
        aria-label="Web ID"
        value={webId}
        onChange={(e) => {
          setWebId(e.target.value);
        }}
        variant="outlined"
        disabled={!userEditingWebId}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <WebIdEditButton lockStatus={userEditingWebId} setLockStatus={setUserEditingWebId} />
            </InputAdornment>
          ),
          style: { width: `${webId.length > 40 ? `${webId.length * 9}px` : '300px'}` }
        }}
      />
    </>
  );
};

export default ManualWebIdForm;
