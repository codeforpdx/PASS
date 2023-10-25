// React Imports
import React from 'react';
// Custom Hook Imports
import { useSession } from '@hooks';
// Material UI Imports
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
// Utility Imports
import { getBlobFromSolid } from '@utils';
// MUI Theme
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
// Constants Imports
import DOC_TYPES from '../../constants/doc_types';

/**
 * DocumentTableRow Component - A row in the Document Table
 *
 * @memberof Documents
 * @name DocumentTableRow
 * @param {object} Props - Props for DocumentTableRow
 * @param {File} Props.document - File object containing the document
 * @param {(modalType: string, docName: string, docType: string)
 * => void} Props.handleAclPermissionsModal - Function for setting up the
 * correct version of the SetAclPermissions Modal, and opening it.
 * @param {(document: object) => void} Props.handleSelectDeleteDoc - method
 * to delete document
 * @returns {React.JSX.Element} The DocumentTableRow component
 */
const DocumentTableRow = ({ document, handleAclPermissionsModal, handleSelectDeleteDoc }) => {
  const { session } = useSession();

  const { name, type, description, fileUrl, uploadDate, endDate } = document;

  const handleShowDocumentLocal = async (urlToOpen) => {
    const urlFileBlob = await getBlobFromSolid(session, urlToOpen);
    window.open(urlFileBlob);
  };

  return (
    <ThemeProvider theme={theme}>
      <TableRow>
        <TableCell align="center">{name}</TableCell>
        <TableCell align="center">{DOC_TYPES[type]}</TableCell>
        <TableCell align="center">{description}</TableCell>
        <TableCell align="center">{uploadDate ? uploadDate.toDateString() : ''}</TableCell>
        <TableCell align="center">{endDate ? endDate.toDateString() : 'N/A'}</TableCell>
        <TableCell align="center">
          <IconButton type="button" onClick={() => handleShowDocumentLocal(fileUrl)}>
            <FileOpenIcon />
          </IconButton>
        </TableCell>
        <TableCell align="center">
          <IconButton
            type="button"
            onClick={() => handleAclPermissionsModal('document', name, type)}
          >
            <ShareIcon />
          </IconButton>
        </TableCell>
        <TableCell align="center">
          <IconButton size="large" edge="end" onClick={() => handleSelectDeleteDoc(document)}>
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </ThemeProvider>
  );
};

export default DocumentTableRow;
