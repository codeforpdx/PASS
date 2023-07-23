// React Imports
import React, { useContext } from 'react';
// Inrupt Imports
import { useSession } from '@hooks';
// Material UI Imports
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import IconButton from '@mui/material/IconButton';
// Utility Imports
import { getBlobFromSolid } from '../../utils';
// Context Imports
import { DocumentListContext } from '../../contexts';
import { StyledTableCell, StyledTableRow } from '../Table/TableStyles';
import DOC_TYPES from '../../constants/doc_types';

/**
 * DocumentTableRow Component - A row in the Document Table
 *
 * @memberof Documents
 * @name DocumentTableRow
 * @param document
 * @returns {React.ReactElement}
 */

const DocumentTableRow = ({ document }) => {
  const { session } = useSession();
  const { removeDocument } = useContext(DocumentListContext);

  const { name, type, description, fileUrl, uploadDate, endDate } = document;

  const handleShowDocumentLocal = async (urlToOpen) => {
    const urlFileBlob = await getBlobFromSolid(session, urlToOpen);
    const newWindow = window.open(urlFileBlob);

    if (newWindow) {
      newWindow.addEventListener('beforeunload', () => {
        // Clear Blob from browser memory when new window is closed
        URL.revokeObjectURL(urlFileBlob);
      });
    } else {
      // If window cannot be opened, we can immediately clear the Blob from browser memory
      URL.revokeObjectURL(urlFileBlob);
    }
  };

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
      <StyledTableCell align="center">{endDate ? endDate.toDateString() : 'N/A'}</StyledTableCell>
      <StyledTableCell align="center">
        <IconButton type="button" onClick={() => handleShowDocumentLocal(fileUrl)}>
          <FileOpenIcon />
        </IconButton>
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
