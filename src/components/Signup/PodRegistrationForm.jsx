import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import FilledInput from '@mui/material/FilledInput';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';

const textFieldStyle = {
  width: '100%',
  border: '1px solid #ccc'
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '24px'
};

const cardStyle = {
  padding: '24px',
  width: '400px',
  margin: '32px auto',
  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 3px 10px 0 rgba(0, 0, 0, 0.1)',
  paddingTop: '24px',
  paddingBottom: '32px'
};

const PodRegistrationForm = ({ register, caseManagerName }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();

  const handleSubmit = async (event) => {
    event.preventDefault();
    register(email, password, confirmPassword);
  };

  return (
    <>
      {caseManagerName && (
        <p style={{ textAlign: 'center' }}>Registering with: {caseManagerName}</p>
      )}
      {searchParams.get('webId') && (
        <p style={{ textAlign: 'center' }}>Registering with: {searchParams.get('webId')}</p>
      )}
      <Card variant="outlined" sx={cardStyle}>
        <CardHeader title="Set Up a New Pod" sx={headerStyle} />
        <form onSubmit={handleSubmit} autoComplete="off">
          <Grid container direction="column" spacing={2}>
            <Grid item xs={12} style={{ marginBottom: '20px' }}>
              <TextField
                style={textFieldStyle}
                id="email-form"
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} style={{ marginBottom: '20px' }}>
              <InputLabel htmlFor="password-form">Password</InputLabel>
              <FilledInput
                style={textFieldStyle}
                id="password-form"
                inputProps={{ 'aria-label': 'Password' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                minLength="8"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel htmlFor="confirm-password-form">Confirm Password</InputLabel>
              <FilledInput
                style={textFieldStyle}
                id="confirm-password-form"
                inputProps={{ 'aria-label': 'Confirm Password' }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showConfirmPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                minLength="8"
                required
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <Button variant="contained" color="primary" size="large" type="submit" fullWidth>
                Set up your Pod
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </>
  );
};

export default PodRegistrationForm;
