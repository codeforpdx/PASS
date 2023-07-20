// React Imports
import React, { useContext } from 'react';
// Material UI Imports
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// Component Imports
import { DocumentListContext, UserDocumentListContext } from '../../contexts';
import { StyledTableCell } from '../Table/TableStyles';
import DocumentTableRow from './DocumentTableRow';
import { EmptyListNotification, LoadingAnimation } from '../Notification';

/**
 * DocumentTable Component - Displays a table containing all documents accessible in a pod
 *
 * @memberof Documents
 * @name DocumentTable
 * @param user
 * @returns {React.ReactElement} a table of documents
 */

const DocumentTable = ({ user }) => {
  const { documentListObject, loadingDocuments } =
    user === 'personal' ? useContext(UserDocumentListContext) : useContext(DocumentListContext);
  const columnTitlesArray = [
    'Name',
    'Type',
    'Description',
    'Upload Date',
    'Expiration Date',
    'Preview File',
    'Delete'
  ];

  const determineDocumentsTable = documentListObject?.docList?.length ? (
    // render if documents
    <Container>
      <TableContainer component={Paper} sx={{ margin: '1rem 0' }}>
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
              <DocumentTableRow key={document.name} document={document} user={user} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  ) : (
    // render if no documents
    <EmptyListNotification type="documents" />
  );

  // MAIN RETURN OF COMPONENT
  return loadingDocuments ? <LoadingAnimation loadingItem="documents" /> : determineDocumentsTable;
};

export default DocumentTable;
