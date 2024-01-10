// React Imports
import React, { useState, useEffect } from 'react';
// MUI Imports
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// Custom Hooks Imports
import { useCivicProfile } from '@hooks';

/**
 * HousingInfo - A form to fill out with housing security info
 *
 * @memberof CivicProfileForms
 * @name HousingInfo
 * @returns {React.JSX.Element} The HousingInfo Component
 */
const HousingInfo = () => {
  const { data, add, isSuccess } = useCivicProfile();
  const [formData, setFormData] = useState({
    lastPermanentStreet: '',
    lastPermanentCity: '',
    lastPermanentState: '',
    lastPermanentZIP: ''
  });

  useEffect(() => {
    if (isSuccess) {
      setFormData((prevFormData) => ({ ...prevFormData, ...data }));
    }
  }, [isSuccess, data]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isSuccess) {
      return;
    }
    add(formData);
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
          value={formData.lastPermanentStreet}
        />
        <TextField
          id="city-input"
          name="lastPermanentCity"
          label="City:"
          onChange={handleChange}
          value={formData.lastPermanentCity}
        />
        <TextField
          id="state-input"
          name="lastPermanentState"
          label="State:"
          onChange={handleChange}
          value={formData.lastPermanentState}
        />
        <TextField
          id="zip-input"
          name="lastPermanentZIP"
          label="ZIP Code:"
          onChange={handleChange}
          value={formData.lastPermanentZIP}
        />
      </div>
      <Button variant="outlined" disabled={!isSuccess} type="submit" style={{ margin: '8px' }}>
        Submit
      </Button>
    </form>
  );
};

export default HousingInfo;
