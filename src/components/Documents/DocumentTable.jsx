// React Imports
import React, { useContext } from 'react';

// Constants
import DOC_TYPES from '@constants/doc_types';

// Material UI Imports
import Box from '@mui/material/Box';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ShareIcon from '@mui/icons-material/Share';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton
} from '@mui/x-data-grid';

// Context Imports
import { DocumentListContext } from '@contexts';
import { useSession } from '@hooks';

// Utility Imports
import { getBlobFromSolid } from '@utils';

// Component Imports
import theme from '../../theme';
import { EmptyListNotification, LoadingAnimation } from '../Notification';

// DataGrid Toolbar
const CustomToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarFilterButton />
    <GridToolbarDensitySelector />
  </GridToolbarContainer>
);

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
  const { session } = useSession();
  const { documentListObject, loadingDocuments } = useContext(DocumentListContext);

  /**
   * Handles the local display of a document by opening it in a new window.
   *
   * @async
   * @function
   * @param {string} urlToOpen - The URL of the document to be opened.
   * @throws {Error} Throws an error if there is an issue fetching the document blob.
   * @returns {Promise<void>} A promise that resolves after the document is opened.
   * @example
   * // Example usage:
   * const documentUrl = 'https://example.com/document.pdf';
   * await handleShowDocumentLocal(documentUrl);
   */
  const handleShowDocumentLocal = async (urlToOpen) => {
    /**
     * Fetches a Blob from a Solid pod based on the provided session and URL.
     *
     * @async
     * @function
     * @param {object} session - The Solid session object.
     * @param {string} url - The URL of the document on the Solid pod.
     * @returns {Promise<Blob>} A promise that resolves with the Blob of the document.
     * @throws {Error} Throws an error if there is an issue fetching the document blob.
     */
    const urlFileBlob = await getBlobFromSolid(session, urlToOpen);

    // Opens a new window with the Blob URL displaying the document.
    window.open(urlFileBlob);
  };

  const columnTitlesArray = [
    {
      headerName: 'Name',
      field: 'name',
      minWidth: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      headerName: 'Type',
      field: 'type',
      minWidth: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      headerName: 'Description',
      field: 'description',
      minWidth: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      headerName: 'Upload Date',
      field: 'upload date',
      minWidth: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      headerName: 'Expiration Date',
      field: 'expiration date',
      minWidth: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      headerName: 'Preview File',
      field: 'preview file',
      minWidth: 100,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      renderCell: (fileUrl) => (
        <GridActionsCellItem
          key={String(fileUrl)}
          icon={<FileOpenIcon />}
          onClick={() => handleShowDocumentLocal(fileUrl)}
          label="Preview"
        />
      )
    },
    {
      headerName: 'Sharing',
      field: 'sharing',
      type: 'actions',
      minWidth: 80,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      getActions: (data) => [
        <GridActionsCellItem
          icon={<ShareIcon />}
          onClick={() => handleAclPermissionsModal('documents', data.name, data.type)}
          label="Share"
        />
      ]
    },
    {
      headerName: 'Delete',
      field: 'actions',
      type: 'actions',
      minWidth: 80,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      getActions: (data) => [
        <GridActionsCellItem
          icon={<DeleteOutlineOutlinedIcon />}
          onClick={() => handleSelectDeleteDoc(data.row.delete)}
          label="Delete"
        />
      ]
    }
  ];

  // Updates type value to use DOC_TYPES for formatting the string
  const mappingType = (type) => DOC_TYPES[type] || type;

  // Map types for each document in the array
  const mappedDocuments = documentListObject?.docList.map((document) => ({
    ...document,
    type: mappingType(document.type)
  }));

  const determineDocumentsTable = mappedDocuments?.length ? (
    // render if documents
    <Box sx={{ margin: '20px 0', width: '90vw', height: '500px' }}>
      <DataGrid
        columns={columnTitlesArray}
        rows={mappedDocuments.map((document) => ({
          id: document.name,
          type: document.type,
          name: document.name,
          description: document.description,
          delete: document,
          'upload date': document?.uploadDate.toLocaleDateString(),
          'expiration date': document?.endDate?.toLocaleDateString(),
          'preview file': document.fileUrl
        }))}
        pageSizeOptions={[10]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 }
          }
        }}
        slots={{
          toolbar: CustomToolbar
        }}
        disableColumnMenu
        disableRowSelectionOnClick
        sx={{
          '.MuiDataGrid-columnHeader': {
            background: theme.palette.primary.light,
            color: 'white'
          },
          '.MuiDataGrid-columnSeparator': {
            display: 'none'
          }
        }}
      />
    </Box>
  ) : (
    // render if no documents
    <EmptyListNotification type="documents" />
  );

  // MAIN RETURN OF COMPONENT
  return loadingDocuments ? <LoadingAnimation loadingItem="documents" /> : determineDocumentsTable;
};

export default DocumentTable;
