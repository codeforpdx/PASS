import React from 'react';
import { docTypes } from '../../utils/form-helper';

const DocumentSelection = ({ htmlId }) => {
	return (
		<select id={htmlId} name="document">
			{docTypes.map((doc, index) => {
				return <option key={index}>{doc}</option>;
			})}
		</select>
	);
};

export default DocumentSelection;
