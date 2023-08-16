// React Imports
import React, { useContext } from 'react';
// Custon Hook Imports
import { useSession } from '@hooks';
// Material UI Imports
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import IconButton from '@mui/material/IconButton';
import ShieldIcon from '@mui/icons-material/Shield';
// Utility Imports
import { getBlobFromSolid } from '@utils';
// Context Imports
import { DocumentListContext } from '@contexts';
// Component Imports
import { StyledTableCell, StyledTableRow } from '../Table/TableStyles';
// Constants Imports
import DOC_TYPES from '../../constants/doc_types';

/**
 * @typedef {import("../../typedefs.js").documentTableRowProps} documentTableRowProps
 */

/**
 * DocumentTableRow Component - A row in the Document Table
 *
 * @memberof Documents
 * @name DocumentTableRow
 * @param {documentTableRowProps} Props - Props for DocumentTableRow
 * @returns {React.JSX.Element} The DocumentTableRow component
 */
const DocumentTableRow = ({ document, handleModal }) => {
  const { session } = useSession();
  const { removeDocument } = useContext(DocumentListContext);

  const { name, type, description, fileUrl, uploadDate, endDate } = document;

  const handleShowDocumentLocal = async (urlToOpen) => {
    const urlFileBlob = await getBlobFromSolid(session, urlToOpen);
    window.open(urlFileBlob);
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
        <IconButton type="button" onClick={() => handleModal('document', name)}>
          <ShieldIcon />
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
