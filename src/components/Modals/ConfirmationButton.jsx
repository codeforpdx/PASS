// ReactImports
import React from 'react';
// Material UI Imports
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';

/**
 * confirmationButtonProps is an object that stores the props for the
 * ConfirmationModal component
 *
 * @typedef {object} confirmationButtonProps
 * @property {string} title - text rendered in confirmationButton
 * @property {Function} confirmFunction - method that runs onClick of button
 * @property {boolean} processing - state used to disable button
 * @memberof typedefs
 */

/**
 * ConfirmationButton Component - Component that renders the confirm/affirm/yes
 * button on the ConfirmationModal Component
 *
 * @memberof Modals
 * @name ConfirmationButton
 * @param {confirmationButtonProps} props - Props used for ConfirmationButton
 * @returns {React.JSX.Element} - The confirmation button
 */
const ConfirmationButton = ({ title, confirmFunction, processing }) => (
  <Button
    variant="contained"
    color="primary"
    endIcon={<CheckIcon />}
    onClick={confirmFunction}
    disabled={processing}
    sx={{ marginLeft: '1rem' }}
  >
    {title}
  </Button>
);

export default ConfirmationButton;
