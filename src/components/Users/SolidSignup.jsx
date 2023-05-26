import React, { useState } from 'react';
import { TextField, Box, Button } from '@mui/material';

import { SOLID_IDENTITY_PROVIDER } from '../../utils';

const style = {
  display: 'flex',
  flexDirection: 'row',
  marginLeft: '8px'
};

const SolidSignup = () => {
  const [oidcIssuer, setOidcIssuer] = useState(SOLID_IDENTITY_PROVIDER);

  return (
    <div style={style}>
      <TextField
        type="text"
        label="Pod Server URL"
        variant="filled"
        value={oidcIssuer}
        onChange={(e) => setOidcIssuer(e.target.value)}
        InputProps={{
          disableUnderline: true,
          'aria-label': 'OIDC Input Field'
        }}
        sx={{
          backgroundColor: 'white',
          borderRadius: '8px'
        }}
      />
      <Box sx={{ marginRight: '32px' }} />
      <Button
        variant="contained"
        color="primary"
        size="large"
        aria-label="Login Button"
        onClick={() => {}}
      >
        Sign Up for a Pod
      </Button>
    </div>
  );
};

export default SolidSignup;
