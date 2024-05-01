import React /* , { useState, useEffect } */ from 'react';
import TextField from '@mui/material/TextField';
// Custom Hooks Imports
// import { useCivicProfile } from '@hooks';

const HousingInfoTextField = ({ label, name, value, onChange }) => (
  <TextField id="street-input" name={name} label={label} onChange={onChange} value={value} />
);

export default HousingInfoTextField;
