import React from 'react';
import docTypes from '../../utils/form-helper';

/**
 * DocumentSelection Component - Sub-component that generates the drop down box for selecting document type to Solid Pod via Solid Session
 * @memberof Forms
 * @component
 * @name DocumentSelection
 * @returns {void}
 */

const DocumentSelection = ({ htmlId }) => (
  <select id={htmlId} name="document">
    {docTypes.map((doc) => (
      <option key={doc.split(' ')[0]}>{doc}</option>
    ))}
  </select>
);

export default DocumentSelection;
