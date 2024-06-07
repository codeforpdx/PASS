/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
// React Imports
import React, { useState } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridToolbarFilterButton,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
// Custom Hooks Imports
import useNotification from '@hooks/useNotification';
// Util Imports
import { saveToClipboard } from '@utils';
// Component Imports
import ContactProfileIcon from './ContactProfileIcon';
import { NewMessageModal } from '../Modals';

// JSDocs
const ContactListTableMobile = () => {
  return <div>ContactListTableMobile</div>;
};

export default ContactListTableMobile;
