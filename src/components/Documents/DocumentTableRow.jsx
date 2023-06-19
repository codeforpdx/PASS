// React Imports
import React, { useContext } from 'react';
// React Router Imports
import { Link } from 'react-router-dom';
// Material UI Imports
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
// Context Imports
import { DocumentListContext } from '../../contexts';
import { StyledTableCell, StyledTableRow } from '../Table/TableStyles';
import DOC_TYPES from '../../constants/doc_types';

/**
 * DocumentTableRow Component - Component that generates the individual table
 *
 * @memberof Documents
 * @name DocumentTableRow
 * @param document
 * @returns {React.ReactElement}
 */

const DocumentTableRow = ({ document }) => {
  const theme = useTheme();
  const { removeDocument } = useContext(DocumentListContext);

  const { name, type, description, fileUrl, uploadDate, endDate } = document;

  // Event handler for deleting client from client list
  const handleDeleteDocument = async () => {
    if (
      !window.confirm(
        `You're about to delete ${document.name} from the pod, do you wish to continue?`
      )
    ) {
      return;
    }
    await removeDocument(document.name);
  };

  return (
    <StyledTableRow>
      <StyledTableCell align="center">{name}</StyledTableCell>
      <StyledTableCell align="center">{DOC_TYPES[type]}</StyledTableCell>
      <StyledTableCell align="center">{description}</StyledTableCell>
      <StyledTableCell align="center">
        {uploadDate ? uploadDate.toDateString() : ''}
      </StyledTableCell>
      <StyledTableCell align="center">{endDate ? endDate.toDateString() : ''}</StyledTableCell>
      <StyledTableCell align="center">
        <Link
          to={fileUrl}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'none', color: theme.palette.primary.dark }}
        >
          {fileUrl}
        </Link>
      </StyledTableCell>
      <StyledTableCell align="center">
        <IconButton size="large" edge="end" onClick={() => handleDeleteDocument()}>
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default DocumentTableRow;
