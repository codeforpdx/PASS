// ReactImports
import React from 'react';
// Material UI Imports
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';

/**
 * ConfirmationButton Component - Component that renders the confirm/affirm/yes
 * button on the ConfirmationModal Component
 *
 * @memberof Modals
 * @name ConfirmationButton
 * @param {object} Props - Props used for ConfirmationButton
 * @param {string} Props.title - text rendered in confirmationButton
 * @param {Function} Props.confirmFunction - method that runs onClick of button
 * @param {boolean} Props.processing - state used to disable button
 * @returns {React.JSX.Element} - The confirmation button
 */
const ConfirmationButton = ({ title, confirmFunction, processing }) => (
  <Button
    variant="contained"
    color="primary"
    endIcon={<CheckIcon />}
    onClick={confirmFunction}
    disabled={processing}
    fullWidth
  >
    {title}
  </Button>
);

export default ConfirmationButton;
