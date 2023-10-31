// React Imports
import React, { useState } from 'react';
// Material UI Imports
import Button from '@mui/material/Button';
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
// Component Imports
import { FormSection } from '../Form';

const BasicInfo = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <FormSection title="Basic Information">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            id="firstName"
            name="firstName"
            label="First name"
            fullWidth
            autoComplete="given-name"
            variant="standard"
            value={firstName}
            onChange={handleFirstNameChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="lastName"
            name="lastName"
            label="Last name"
            fullWidth
            autoComplete="family-name"
            variant="standard"
            value={lastName}
            onChange={handleLastNameChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name="date"
                format="YYYY-MM-DD"
                label="Date of birth"
                type="date"
                value={age}
                onChange={handleAgeChange}
              />
            </LocalizationProvider>
            <FormHelperText>YYYY-MM-DD</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="hmis-basic-info-gender">Gender</InputLabel>
            <Select
              labelId="hmis-basic-info-gender"
              id="hmis-basic-info-gender"
              value={gender}
              label="Gender"
              onChange={handleGenderChange}
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
            fullWidth
            sx={{ borderRadius: '20px' }}
          >
            Clear Form
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            fullWidth
            sx={{ borderRadius: '20px' }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </FormSection>
  );
  /* eslint-disable jsx-a11y/label-has-associated-control */
};

export default BasicInfo;
