// React Imports
import React, { useContext } from 'react';
// Material UI Imports
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// Component Imports
import { DocumentListContext } from '../../contexts';
import { StyledTableCell } from '../Table/TableStyles';
import DocumentTableRow from './DocumentTableRow';
import Loading from '../Notification/Loading';

/**
 * DocumentTable Component - Displays a table containing all documents accessible in a pod
 *
 * @memberof Documents
 * @name DocumentTable
 * @returns {React.ReactElement} a table of documents
 */
const DocumentTable = () => {
  const { documentListObject, loadingDocuments } = useContext(DocumentListContext);
  const columnTitlesArray = [
    'Name',
    'Type',
    'Description',
    'Upload Date',
    'Expiration Date',
    'File URL',
    'Delete'
  ];

  return loadingDocuments ? (
    <Loading loadingItem="documents" />
  ) : (
    <TableContainer component={Paper} sx={{ marginTop: '3rem', marginBottom: '3rem' }}>
      <Table aria-label="Documents Table">
        <TableHead>
          <TableRow>
            {columnTitlesArray.map((columnTitle) => (
              <StyledTableCell key={columnTitle} align="center">
                {columnTitle}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {documentListObject?.docList.map((document) => (
            <DocumentTableRow key={document.name} document={document} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DocumentTable;
