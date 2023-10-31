// React Imports
import React, { useState } from 'react';
// Inrupt Library Imports
// import { useSession } from '@hooks';
// Material UI Imports
// import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// import Checkbox from '@mui/material/Checkbox';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FormControl from '@mui/material/FormControl';
// import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
// import IconButton from '@mui/material/IconButton';
// import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// Utility Imports
// import { sendMessageTTL, getMessageTTL } from '@utils';
// Context Imports
// import { MessageContext, SignedInUserContext } from '@contexts';
// Custom Hook Imports
// import useNotification from '@hooks/useNotification';
// Component Imports
import { FormSection } from '../Form';

const BasicInfo = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState('');

  const clearForm = () => {
    setFirstName('');
    setLastName('');
    setAge(null);
    setGender('');
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
            onChange={(newFirstName) => setFirstName(newFirstName.target.value)}
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
            onChange={(newLastName) => setLastName(newLastName.target.value)}
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
                onChange={(newAge) => setAge(newAge)}
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
              onChange={(newGender) => setGender(newGender.target.value)}
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
            onClick={clearForm}
          >
            Cancel
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
