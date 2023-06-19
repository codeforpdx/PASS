// React Imports
import React, { useContext } from 'react';
// Inrupt Library Imports
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DocumentListContext } from '../../contexts';
import { StyledTableCell } from '../Table/TableStyles';
import DocumentTableRow from './DocumentTableRow';

/**
 * FetchDocumentForm Component - Component that generates the form for searching
 * a specific document type from a user's Solid Pod via Solid Session
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

  return loadingDocuments ? null : (
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
