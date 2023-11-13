// React Imports
import React, { useState } from 'react';
// MUI Imports
import { TextField, Button } from '@mui/material';
import { useCivicProfile } from '@hooks';

const HousingInfo = () => {
  const { data, add, isSuccess } = useCivicProfile();
  const [formData, setFormData] = useState({
    lastPermanentStreet: '',
    lastPermanentCity: '',
    lastPermanentState: '',
    lastPermanentZIP: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isSuccess) {
      return;
    }
    const newProfile = { ...data, ...formData };
    add(newProfile);
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
          name="lastPermanentStreet"
          label="Street:"
          onChange={handleChange}
          value={formData.street}
        />
        <TextField
          id="city-input"
          name="lastPermanentCity"
          label="City:"
          onChange={handleChange}
          value={formData.city}
        />
        <TextField
          id="state-input"
          name="lastPermanentState"
          label="State:"
          onChange={handleChange}
          value={formData.state}
        />
        <TextField
          id="zip-input"
          name="lastPermanentZIP"
          label="ZIP Code:"
          onChange={handleChange}
          value={formData.zip}
        />
      </div>
      <Button variant="outlined" disabled={!isSuccess} type="submit" style={{ margin: '8px' }}>
        Submit
      </Button>
    </form>
  );
};

export default HousingInfo;
