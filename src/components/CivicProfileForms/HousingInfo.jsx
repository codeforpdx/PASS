// React Imports
import React, { useState } from 'react';
// MUI Imports
import { TextField, Button } from '@mui/material';

const HousingInfo = () => {
  const [formData, setFormData] = useState({ street: '', city: '', state: '', zip: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxWidth: '360px'
        }}
      >
        <TextField
          id="street-input"
          name="street"
          label="Street:"
          onChange={handleChange}
          value={formData.street}
        />
        <TextField
          id="city-input"
          name="city"
          label="City:"
          onChange={handleChange}
          value={formData.city}
        />
        <TextField
          id="state-input"
          name="state"
          label="State:"
          onChange={handleChange}
          value={formData.state}
        />
        <TextField
          id="zip-input"
          name="zip"
          label="ZIP Code:"
          onChange={handleChange}
          value={formData.zip}
        />
      </div>
      <Button variant="outlined" type="submit" style={{ margin: '8px' }}>
        Submit
      </Button>
    </form>
  );
};

export default HousingInfo;
