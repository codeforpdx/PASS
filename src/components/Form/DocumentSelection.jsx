// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// Utility Imports
import { docTypes } from '../../utils';

/**
 * DocumentSelection Component - Sub-component that generates the dropdown
 * box/menu for selecting document type to a user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name DocumentSelection
 */

const DocumentSelection = ({ htmlForAndIdProp, handleDocType, docType }) => (
  <Box sx={{ marginTop: '20px' }}>
    <FormControl sx={{ width: 220 }}>
      <InputLabel id={`${htmlForAndIdProp}-label`}>Select Document Type *</InputLabel>
      <Select
        labelId={`${htmlForAndIdProp}-label`}
        id={htmlForAndIdProp}
        label="Select Document Type"
        value={docType}
        onChange={handleDocType}
        name="document"
        required
      >
        {docTypes.map((doc) => (
          <MenuItem key={doc.split(' ')[0]} value={doc}>
            {doc}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
);

export default DocumentSelection;
