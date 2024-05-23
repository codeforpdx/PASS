// React Imports
import React, { useState, useEffect } from 'react';
// MUI Imports
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// Custom Hooks Imports
import { useCivicProfile } from '@hooks';
import { FormSection } from '../Form';

/**
 * HousingInfo - A form to fill out with housing security info
 *
 * @memberof CivicProfileForms
 * @name HousingInfo
 * @returns {React.JSX.Element} The HousingInfo Component
 */
const HousingInfo = () => {
  const { data, add, isSuccess, storedDataset, refetch } = useCivicProfile();
  const [zipError, setZipError] = useState(false);
  const [formData, setFormData] = useState({
    lastPermanentStreet: '',
    lastPermanentCity: '',
    lastPermanentState: '',
    lastPermanentZIP: '',
    monthsHomeless: '',
    timesHomeless: '',
    timeToHousingLoss: ''
  });

  useEffect(() => {
    if (isSuccess) {
      setFormData((prevFormData) => ({ ...prevFormData, ...data }));
    }
  }, [isSuccess, data]);
  useEffect(() => {
    if (!storedDataset) {
      refetch();
    }
  }, [storedDataset]);
  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'lastPermanentZIP') {
      const zipRegex = /^\d{5}(-\d{4})?$/;
      if (!zipRegex.test(value)) {
        setZipError(true);
      } else {
        setZipError(false);
      }
    }

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isSuccess || !storedDataset) {
      return;
    }

    add(formData);
  };

  return (
    <FormSection title="Housing Information">
      <FormControl
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          justifyContent: 'space-between'
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '8px',
            minWidth: '846px',
            padding: '8px'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '8px',
              width: '40%'
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
              error={zipError}
              helperText={zipError ? 'Invalid ZIP format. Expected: 12345 or 12345-6789' : ''}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '8px',
              width: '40%'
            }}
          >
            <TextField
              id="months-homeless-input"
              name="monthsHomeless"
              label="Months Houseless Past 3 Years:"
              onChange={handleChange}
              value={formData.monthsHomeless}
            />
            <TextField
              id="times-homeless-input"
              name="timesHomeless"
              label="Number of Times Houseless Past 3 Years:"
              onChange={handleChange}
              value={formData.timesHomeless}
            />
            <TextField
              id="time-to-housing-loss-input"
              name="timeToHousingLoss"
              label="Time Until Loss of Housing:"
              onChange={handleChange}
              value={formData.timeToHousingLoss}
            />
          </div>
        </div>
        <div
          style={{
            alignSelf: 'flex-start',
            display: 'flex',
            flexDirection: 'column',
            padding: '8px'
          }}
        >
          <Button variant="outlined" disabled={!isSuccess} type="submit" style={{ margin: '8px' }}>
            Submit
          </Button>
        </div>
      </FormControl>
    </FormSection>
  );
};

export default HousingInfo;
