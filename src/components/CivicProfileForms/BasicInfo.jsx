// React Imports
import React, { useState, useEffect } from 'react';
// Material UI Imports
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// Hook Imports
import { useCivicProfile } from '@hooks';
// Component Imports
import { FormSection } from '../Form';

/**
 * BasicInfo Component - A form to fill out basic user info
 *
 * @memberof CivicProfileForms
 * @name BasicInfo
 * @returns {React.JSX.Element} The BasicInfo Component
 */
const BasicInfo = () => {
  const { data, add, isSuccess } = useCivicProfile();
  const [formData, setFormData] = useState({
    legalFirstName: '',
    legalLastName: '',
    legalDOB: '',
    legalGender: ''
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
  const handleClear = () => {
    setFormData({ legalFirstName: '', legalLastName: '', legalDOB: '', legalGender: '' });
  };

  return (
    <FormSection
      title="Basic Information"
      component="form"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <Grid container spacing={{ xs: 2, sm: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            id="hmis-basic-info-first-name"
            name="legalFirstName"
            label="Legal first name"
            onChange={handleChange}
            value={formData.legalFirstName}
            fullWidth
            autoFocus
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="hmis-basic-info-last-name"
            name="legalLastName"
            label="Legal last name"
            onChange={handleChange}
            value={formData.legalLastName}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                id="hmis-basic-info-date-of-birth"
                name="legalDOB"
                label="Date of birth"
                onChange={handleChange}
                value={formData.legalDOB}
                format="YYYY-MM-DD"
                type="date"
                disableFuture
                openTo="year"
                views={['year', 'month', 'day']}
              />
            </LocalizationProvider>
            <FormHelperText>YYYY-MM-DD</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="hmis-basic-info-gender">Gender</InputLabel>
            <Select
              id="hmis-basic-info-gender-select"
              name="legalGender"
              label="Gender"
              onChange={handleChange}
              value={formData.legalGender}
              labelId="hmis-basic-info-gender"
              defaultValue=""
            >
              <MenuItem value={0}>Female</MenuItem>
              <MenuItem value={1}>Male</MenuItem>
              <MenuItem value={2}>Transgender male to female</MenuItem>
              <MenuItem value={3}>Transgender female to male</MenuItem>
              <MenuItem value={4}>Doesn&apos;t identify as male, female or transgender</MenuItem>
              <MenuItem value={8}>Don&apos;t know</MenuItem>
              <MenuItem value={9}>Decline to answer</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="outlined"
            type="submit"
            color="error"
            startIcon={<ClearIcon />}
            fullWidth
            sx={{ borderRadius: '20px' }}
            onClick={handleClear}
          >
            Clear
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            startIcon={<CheckIcon />}
            fullWidth
            sx={{ borderRadius: '20px' }}
            disabled={!isSuccess}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </FormSection>
  );
};

export default BasicInfo;
