// React Imports
import React from 'react';
// Material UI Imports
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
// Utility Imports
import docTypes from '../../utils/form-helper';

/**
 * DocumentSelection Component - Sub-component that generates the dropdown
 * box/menu for selecting document type to a user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name DocumentSelection
 */

const DocumentSelection = ({ htmlId, value, onChange }) => (
  <Select
    id={htmlId}
    labelId={`${htmlId}-label`}
    value={value || ''}
    label="Select Document Type"
    onChange={onChange}
  >
    {docTypes.map((doc) => (
      <MenuItem key={doc.split(' ')[0]} value={doc}>
        {doc}
      </MenuItem>
    ))}
  </Select>
);

export default DocumentSelection;
