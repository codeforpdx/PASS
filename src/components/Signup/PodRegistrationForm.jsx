// React Imports
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
// Material UI Imports
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import FilledInput from '@mui/material/FilledInput';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Visibility, VisibilityOff } from '@mui/icons-material';

/* Styles for MUI components */
const cardStyle = {
  padding: '8px',
  margin: '8px',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
};

const formRowStyle = {
  margin: '20px 0'
};

const textFieldStyle = {
  margin: '8px'
};

/**
 * PodRegistrationForm - Component for user registration in a Solid Pod.
 *
 * @memberof Signup
 * @name PodRegistrationForm
 * @param {object} props - Component props
 * @param {Function} props.register - The function to handle user registration
 * @param {string} props.caseManagerName - The name of the case manager (optional)
 * @param {object} props.previousInfo - previous info in case an error occurs
 * @returns {React.Element} The rendered React component
 */
const PodRegistrationForm = ({ register, caseManagerName, previousInfo = null }) => {
  const [email, setEmail] = useState(previousInfo ? previousInfo.email : '');
  const [password, setPassword] = useState(previousInfo ? previousInfo.password : '');
  const [confirmPassword, setConfirmPassword] = useState(
    previousInfo ? previousInfo.confirmPassword : ''
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [searchParams] = useSearchParams();
  const handleSubmit = async (event) => {
    event.preventDefault();
    register(email, password, confirmPassword);
  };

  return (
    <>
      <Typography
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={2}
        variant="h5"
        component="h3"
      >
        Register For PASS
      </Typography>
      {searchParams.get('webId') && (
        <p>You will register with {caseManagerName ?? searchParams.get('webId')}</p>
      )}

      <Card variant="outlined" sx={cardStyle}>
        <CardHeader title="Set Up a New Pod" />

        <form onSubmit={handleSubmit} style={formRowStyle} autoComplete="off">
          <TextField
            style={textFieldStyle}
            id="email-form"
            aria-label="Email"
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <InputLabel htmlFor="password-form">Password</InputLabel>
          <FilledInput
            style={textFieldStyle}
            id="password-form"
            inputProps={{
              'aria-label': 'Password'
            }}
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
          <br />
          <InputLabel htmlFor="confirm-password-form">Confirm Password</InputLabel>
          <FilledInput
            style={textFieldStyle}
            id="confirm-password-form"
            inputProps={{
              'aria-label': 'Confirm Password'
            }}
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
          <br />
          <Button
            variant="contained"
            color="primary"
            size="large"
            aria-label="Sign Up For a Pod"
            type="submit"
          >
            Set up your Pod
          </Button>
        </form>
      </Card>
    </>
  );
};

export default PodRegistrationForm;
