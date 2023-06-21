// React Imports
import React, { useContext } from 'react';
// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
// Component Imports
import { DocumentListContext } from '../../contexts';
import { StyledTableCell } from '../Table/TableStyles';
import DocumentTableRow from './DocumentTableRow';
import LoadingAnimation from '../Notification/LoadingAnimation';

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
    'Preview File',
    'Delete'
  ];

  const determineDocumentsTable = documentListObject?.docList?.length ? (
    // render if documents
    <Container>
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
    </Container>
  ) : (
    // render if no documents
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ marginTop: '3rem', marginBottom: '3rem' }}>
        <Paper elevation={2} sx={{ display: 'inline-block', mx: '2px', padding: '20px' }}>
          <Typography variant="h6" component="h2" mb={2} align="center" color="secondary">
            No documents found.
            <br />
            Uploaded documents will be listed here.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );

  // MAIN RETURN OF FUNCTION
  return loadingDocuments ? <LoadingAnimation loadingItem="documents" /> : determineDocumentsTable;
};

export default DocumentTable;
