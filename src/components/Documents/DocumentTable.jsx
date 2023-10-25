// React Imports
import React, { useContext } from 'react';
// Material UI Imports
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// Context Imports
import { DocumentListContext } from '@contexts';
// Component Imports
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import DocumentTableRow from './DocumentTableRow';
import { EmptyListNotification, LoadingAnimation } from '../Notification';

/**
 * DocumentTable Component - The Document Table that shows the list of documents
 * stored on Solid
 *
 * @memberof Documents
 * @name DocumentTable
 * @param {object} Props - Props for DocumentTable component
 * @param {(modalType: string, docName: string, docType: string)
 * => void} Props.handleAclPermissionsModal - Function for setting up the
 * correct version of the SetAclPermissions Modal, and opening it.
 * @param {(document: object) => void} Props.handleSelectDeleteDoc - method
 * to delete document
 * @returns {React.JSX.Element} The DocumentTable component
 */
const DocumentTable = ({ handleAclPermissionsModal, handleSelectDeleteDoc }) => {
  const { documentListObject, loadingDocuments } = useContext(DocumentListContext);
  const columnTitlesArray = [
    'Name',
    'Type',
    'Description',
    'Upload Date',
    'Expiration Date',
    'Preview File',
    'Sharing',
    'Delete'
  ];

  const determineDocumentsTable = documentListObject?.docList?.length ? (
    // render if documents
    <ThemeProvider theme={theme}>
      <Container>
        <TableContainer component={Paper} sx={{ margin: '1rem 0' }}>
          <Table aria-label="Documents Table">
            <TableHead>
              <TableRow>
                {columnTitlesArray.map((columnTitle) => (
                  <TableCell key={columnTitle} align="center">
                    {columnTitle}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {documentListObject?.docList.map((document) => (
                <DocumentTableRow
                  key={document.name}
                  document={document}
                  handleAclPermissionsModal={handleAclPermissionsModal}
                  handleSelectDeleteDoc={handleSelectDeleteDoc}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </ThemeProvider>
  ) : (
    // render if no documents
    <EmptyListNotification type="documents" />
  );

  // MAIN RETURN OF COMPONENT
  return loadingDocuments ? <LoadingAnimation loadingItem="documents" /> : determineDocumentsTable;
};

export default DocumentTable;
