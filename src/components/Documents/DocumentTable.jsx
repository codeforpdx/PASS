// React Imports
import React, { useContext } from 'react';
// Material UI Imports
import Container from '@mui/material/Container';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ShareIcon from '@mui/icons-material/Share';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
// Context Imports
import { DocumentListContext } from '@contexts';
import { useSession } from '@hooks';

// Utility Imports
import { getBlobFromSolid } from '@utils';

// Component Imports
import theme from '../../theme';
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
  const { session } = useSession();
  const { documentListObject, loadingDocuments } = useContext(DocumentListContext);

  const handleShowDocumentLocal = async (urlToOpen) => {
    const urlFileBlob = await getBlobFromSolid(session, urlToOpen);
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
      field: 'upload date',
      type: 'dateTime',
      valueGetter: ({ value }) => value && new Date(value),
      minWidth: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'expiration date',
      type: 'dateTime',
      valueGetter: ({ value }) => value && new Date(value),
      minWidth: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'preview file',
      minWidth: 120,
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
      minWidth: 120,
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
      minWidth: 120,
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

  const determineDocumentsTable = documentListObject?.docList?.length ? (
    // render if documents
    <Container>
      <DataGrid
        columns={columnTitlesArray}
        rows={documentListObject?.docList.map((document) => ({
          id: document.name,
          type: document.type,
          name: document.name,
          description: document.description,
          sharing: 'foo',
          delete: document,
          'upload date': document.uploadDate,
          'expiration date': document.endDate,
          'preview file': document.fileUrl
        }))}
        pageSizeOptions={[10]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 }
          }
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
    </Container>
  ) : (
    // render if no documents
    <EmptyListNotification type="documents" />
  );

  // MAIN RETURN OF COMPONENT
  return loadingDocuments ? <LoadingAnimation loadingItem="documents" /> : determineDocumentsTable;
};

export default DocumentTable;
