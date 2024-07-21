import React from 'react';
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
// Theme Imports
import theme from '../../theme';

// DataGrid Toolbar
const CustomToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarFilterButton />
    <GridToolbarDensitySelector />
  </GridToolbarContainer>
);

/**
 * @typedef {object} Document
 * @property {string} name - The given name of the document
 * @property {string} type - The given type of the document
 * @property {string} description - The given description of the document
 * @property {string} uploadDate- The upload date of the document
 * @property {string} endDate - The expiration date of the document
 * @property {string} fileUrl - The file URL of the document
 */

/**
 * @typedef {object} Handlers
 * @property {Function} onPreview - Function to handle document previewing.
 * @property {Function} onShare - Function to handle document sharing.
 * @property {Function} onDelete - Function to handle document deletion.
 */

/**
 * DocumentsDesktop - Component for displaying documents in a DataGrid
 *
 * @memberof Documents
 * @name DocumentsDesktop
 * @param {object} Props - The props for DocumentsDesktop
 * @param {Document[]} Props.documents - The list of documents to display
 * @param {Handlers} Props.handlers - Object containing event handler functions.
 * @returns {React.JSX.Element} The DocumentsDesktop component
 */
const DocumentsDesktop = ({ documents, handlers }) => {
  const columnTitlesArray = [
    {
      field: 'name',
      minWidth: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'type',
      minWidth: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'description',
      minWidth: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'upload date',
      minWidth: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'expiration date',
      minWidth: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
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
          onClick={() => handlers.onPreview(fileUrl)}
          label="Preview"
        />
      )
    },
    {
      field: 'sharing',
      type: 'actions',
      minWidth: 80,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      getActions: (data) => [
        <GridActionsCellItem
          icon={<ShareIcon />}
          onClick={() => handlers.onShare('document', data.row.id, data.row.type)}
          label="Share"
        />
      ]
    },
    {
      field: 'actions',
      type: 'actions',
      minWidth: 80,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      getActions: (data) => [
        <GridActionsCellItem
          icon={<DeleteOutlineOutlinedIcon />}
          onClick={() => handlers.onDelete(data.row.delete)}
          label="Delete"
        />
      ]
    }
  ];
  // Render if documents
  return (
    <DataGrid
      columns={columnTitlesArray}
      rows={documents.map((document) => ({
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
      sx={{
        '.MuiDataGrid-columnHeader': {
          background: theme.palette.primary.light,
          color: 'white'
        },
        '.MuiDataGrid-columnSeparator': {
          display: 'none'
        }
      }}
      disableColumnMenu
      disableRowSelectionOnClick
    />
  );
};

export default DocumentsDesktop;
