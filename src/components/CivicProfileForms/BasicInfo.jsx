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

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <FormSection title="Basic Information">
      <form onSubmit={handleSubmit} autoComplete="off">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="hmis-basic-info-first-name"
              name="hmis-basic-info-first-name"
              label="First name"
              margin="normal"
              fullWidth
              // autoComplete="given-name"
              variant="standard"
              onChange={handleChange}
              value={formData.legalFirstName}
              autofocus
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="hmis-basic-info-last-name"
              name="hmis-basic-info-last-name"
              label="Last name"
              margin="normal"
              fullWidth
              // autoComplete="family-name"
              variant="standard"
              value={formData.legalLastName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  name="hmis-basic-info-dob"
                  format="YYYY-MM-DD"
                  label="Date of birth"
                  // margin="normal"
                  type="date"
                  value={formData.legalDOB}
                />
              </LocalizationProvider>
              <FormHelperText>YYYY-MM-DD</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="hmis-basic-info-gender">Gender</InputLabel>
              <Select
                id="hmis-basic-info-gender"
                label="Gender"
                labelId="hmis-basic-info-gender"
                margin="normal"
                value={formData.legalGender}
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
              variant="contained"
              type="submit"
              color="secondary"
              startIcon={<ClearIcon />}
              fullWidth
              sx={{ borderRadius: '20px' }}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              disabled={!isSuccess}
              type="submit"
              color="primary"
              startIcon={<CheckIcon />}
              fullWidth
              sx={{ borderRadius: '20px' }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormSection>
  );
  /* eslint-disable jsx-a11y/label-has-associated-control */
};

export default BasicInfo;
