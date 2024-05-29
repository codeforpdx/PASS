// React Imports
import React, { useState, useEffect } from 'react';
// MUI Imports
import FormControl from '@mui/material/FormControl';
// import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
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
              value={formData.lastPermanentStreet ?? ''}
            />
            <TextField
              id="city-input"
              name="lastPermanentCity"
              label="City:"
              onChange={handleChange}
              value={formData.lastPermanentCity ?? ''}
            />
            <TextField
              id="state-input"
              name="lastPermanentState"
              label="State:"
              onChange={handleChange}
              value={formData.lastPermanentState ?? ''}
            />
            <TextField
              id="zip-input"
              name="lastPermanentZIP"
              label="ZIP Code:"
              onChange={handleChange}
              value={formData.lastPermanentZIP ?? ''}
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
            <Select
              id="months-homeless-input"
              name="monthsHomeless"
              label="Months Houseless Past 3 Years:"
              onChange={handleChange}
              value={formData.monthsHomeless ?? ''}
            >
              <MenuItem value={101}>1 Month</MenuItem>
              <MenuItem value={102}>2 Months</MenuItem>
              <MenuItem value={103}>3 Months</MenuItem>
              <MenuItem value={104}>4 Months</MenuItem>
              <MenuItem value={105}>5 Months</MenuItem>
              <MenuItem value={106}>6 Months</MenuItem>
              <MenuItem value={107}>7 Months</MenuItem>
              <MenuItem value={108}>8 Months</MenuItem>
              <MenuItem value={109}>9 Months</MenuItem>
              <MenuItem value={110}>10 Months</MenuItem>
              <MenuItem value={111}>11 Months</MenuItem>
              <MenuItem value={112}>12 Months</MenuItem>
              <MenuItem value={113}>More than 12 Months</MenuItem>
              <MenuItem value={8}>Client doesn’t know</MenuItem>
              <MenuItem value={9}>Client refused</MenuItem>
              <MenuItem value={99}>Data not collected</MenuItem>
            </Select>
            <Select
              id="times-homeless-input"
              name="timesHomeless"
              label="Number of Times Houseless Past 3 Years:"
              onChange={handleChange}
              value={formData.timesHomeless ?? ''}
            >
              <MenuItem value={1}>One Time</MenuItem>
              <MenuItem value={2}>Two Times</MenuItem>
              <MenuItem value={3}>Three Times</MenuItem>
              <MenuItem value={4}>Four or more Times</MenuItem>
              <MenuItem value={8}>Client doesn’t know</MenuItem>
              <MenuItem value={9}>Client refused</MenuItem>
              <MenuItem value={99}>Data not collected</MenuItem>
            </Select>
            <Select
              id="time-to-housing-loss-input"
              name="timeToHousingLoss"
              label="Time Until Loss of Housing:"
              onChange={handleChange}
              value={formData.timeToHousingLoss ?? ''}
            >
              <MenuItem value={0}>0-6 Days</MenuItem>
              <MenuItem value={1}>7-13 Days</MenuItem>
              <MenuItem value={2}>14-21 Days</MenuItem>
              <MenuItem value={3}>More than 21 days (0 points)</MenuItem>
              <MenuItem value={99}>Data not collected</MenuItem>
            </Select>
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
