// React Imports
import React, { useState, useEffect } from 'react';
// MUI Imports
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
// Custom Hooks Imports
import { useCivicProfile, useNotification } from '@hooks';
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
  const addNotification = useNotification();
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

  const handleClear = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      lastPermanentStreet: '',
      lastPermanentCity: '',
      lastPermanentState: '',
      lastPermanentZIP: '',
      monthsHomeless: '',
      timesHomeless: '',
      timeToHousingLoss: ''
    }));

    addNotification('success', `Form cleared!`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isSuccess || !storedDataset || zipError) {
      addNotification('error', 'Form error. Please check for errors.');
      return;
    }

    add(formData);
    addNotification('success', `Form submitted!`);
  };

  return (
    <FormSection title="Housing Information">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              justifyContent: 'space-between'
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
          </FormControl>
        </Grid>
        <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <FormControl onSubmit={handleSubmit}>
            <InputLabel id="months-homeless-input-label">Months Houseless Past 3 Years:</InputLabel>
            <Select
              role="option"
              id="months-homeless-input"
              labelId="months-homeless-input-label"
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
          </FormControl>
          <FormControl onSubmit={handleSubmit}>
            <InputLabel id="times-homeless-input-label">
              Number of Times Houseless Past 3 Years:
            </InputLabel>
            <Select
              role="option"
              id="times-homeless-input"
              labelId="times-homeless-input-label"
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
          </FormControl>
          <FormControl onSubmit={handleSubmit}>
            <InputLabel id="time-to-housing-loss-input-label">
              Time Until Loss of Housing:
            </InputLabel>
            <Select
              role="option"
              id="time-to-housing-loss-input"
              labelId="time-to-housing-loss-input-label"
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
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl style={{ display: 'flex' }}>
            <Button
              variant="outlined"
              type="button"
              label="Clear button"
              name="Clear button"
              color="error"
              startIcon={<ClearIcon />}
              fullWidth
              sx={{ borderRadius: '20px' }}
              onClick={handleClear}
              aria-label="Clear button"
            >
              Clear
            </Button>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl style={{ display: 'flex' }}>
            <Button
              variant="contained"
              type="submit"
              name="Submit button"
              label="Submit button"
              color="primary"
              startIcon={<CheckIcon />}
              fullWidth
              sx={{ borderRadius: '20px' }}
              onClick={handleSubmit}
              disabled={!isSuccess}
              aria-label="Submit button"
            >
              Submit
            </Button>
          </FormControl>
        </Grid>
      </Grid>
    </FormSection>
  );
};

export default HousingInfo;
