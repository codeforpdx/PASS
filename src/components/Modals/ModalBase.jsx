// React Imports
import React from 'react';
// Material UI Imports
import Dialog from '@mui/material/Dialog';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

/**
 * ModalBase - Component that renders either a modal dialog or drawer based on screen size
 *
 * @memberof Modals
 * @name ModalBase
 * @param {object} Props - Props for ModalBase component
 * @param {boolean} Props.open - Boolean for opening the modal
 * @param {string} Props.arialabelledby - ID of the element that labels the modal
 * @param {string} Props.ariadescribedby - ID of the element that describes the modal
 * @param {Function} Props.onClose - Function to call when the modal is closed
 * @param {'left'|'top'|'right'|'bottom'} [Props.anchor='left'] - Determines the anchor position for the modal
 * @param {React.JSX.Element} Props.children - Content to be displayed within the modal
 * @returns {React.JSX.Element} - The rendered modal component
 */
const ModalBase = ({ open, arialabelledby, ariadescribedby, onClose, anchor, children }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const DialogOrDrawer = isSmallScreen ? Drawer : Dialog;

  return (
    <DialogOrDrawer
      open={open}
      aria-labelledby={arialabelledby}
      aria-describedby={ariadescribedby}
      onClose={onClose}
      anchor={anchor}
      PaperProps={{
        sx: {
          alignItems: 'center',
          borderRadius: isSmallScreen ? '15px 15px 0px 0px' : '5px'
          // minWidth: '50dvw'
        }
      }}
    >
      {children}
    </DialogOrDrawer>
  );
};

export default ModalBase;
