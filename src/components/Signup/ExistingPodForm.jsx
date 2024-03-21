import React from 'react';

// MUI imports
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

/* Styles for MUI components */
const cardStyle = {
  padding: '8px',
  margin: '8px',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
};

const formRowStyle = {
  margin: '20px 0'
};

const textFieldStyle = {
  margin: '8px'
};

const loginHandler = async () => {
  // similar flow to login
};

const ExistingPodForm = () => (
  <Card style={cardStyle}>
    <CardHeader title="Use Existing Pod" />
    <form style={formRowStyle}>
      <TextField
        id="pod-provider"
        style={textFieldStyle}
        aria-label="Email"
        label="Pod Provider"
        variant="outlined"
        required
      />
      <br />
      <Button
        variant="contained"
        color="primary"
        size="large"
        aria-label="Login to Pod Provider"
        type="submit"
        onClick={() => loginHandler()}
      >
        Login to Pod Provider
      </Button>
    </form>
  </Card>
);

export default ExistingPodForm;
