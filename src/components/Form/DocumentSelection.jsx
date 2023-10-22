// React Imports
import React from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// Utility Imports
import DOC_TYPES from '../../constants/doc_types';

/**
 * DocumentSelection Component - Sub-component that generates the dropdown
 * box/menu for selecting document type to a user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name DocumentSelection
 * @param {object} Props - Props for DocumentSelection Component
 * @param {string} Props.htmlForAndIdProp - String for HTML for and id
 * @param {(event) => void} Props.handleDocType - Handler function for selecting
 * doc type
 * @param {string} Props.docType - The specific doc type selected
 * @returns {React.JSX.Element} - The Document Selection Component
 */
const DocumentSelection = ({ htmlForAndIdProp, handleDocType, docType }) => (
  <Box>
    <FormControl required fullWidth>
      <InputLabel id={`${htmlForAndIdProp}-label`}>Select Document Type</InputLabel>
      <Select
        labelId={`${htmlForAndIdProp}-label`}
        id={htmlForAndIdProp}
        label="Select Document Type"
        value={docType}
        onChange={handleDocType}
        name="document"
      >
        {Object.entries(DOC_TYPES).map(([key, value]) => (
          <MenuItem key={key} value={key}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
);

export default DocumentSelection;
