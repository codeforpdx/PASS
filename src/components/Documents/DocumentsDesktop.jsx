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
 * @property {string} id - The id of the document
 * @property {string} name - The provided name of the document
 * @property {string} type - The provided type of the document
 * @property {string} description - The provided description of the document
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
      field: 'Name',
      minWidth: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'Type',
      minWidth: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'Description',
      minWidth: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'Upload Date',
      minWidth: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'Expiration Date',
      minWidth: 120,
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'Preview',
      minWidth: 100,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      renderCell: (data) => {
        const [id, fileUrl] = data.value;
        return (
          <GridActionsCellItem
            key={`Preview:${String(id)}`}
            icon={<FileOpenIcon />}
            onClick={() => handlers.onPreview(fileUrl)}
            label="Preview"
          />
        );
      }
    },
    {
      field: 'Share',
      minWidth: 100,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      renderCell: (data) => {
        const [id, type] = data.value;
        return (
          <GridActionsCellItem
            key={`Share:${String(data.row.id)}`}
            icon={<ShareIcon />}
            onClick={() => handlers.onShare('document', id, type)}
            label="Share"
          />
        );
      }
    },
    {
      field: 'Delete',
      minWidth: 100,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      renderCell: (data) => {
        const [document] = data.value;
        return (
          <GridActionsCellItem
            key={`Delete:${String(document.id)}`}
            icon={<DeleteOutlineOutlinedIcon />}
            onClick={() => handlers.onDelete(document)}
            label="Delete"
          />
        );
      }
    }
  ];
  // Render if documents
  return (
    <DataGrid
      columns={columnTitlesArray}
      rows={documents.map((document) => ({
        id: document.id,
        Name: document.name,
        Type: document.type,
        Description: document.description,
        'Upload Date': document?.uploadDate.toLocaleDateString(),
        'Expiration Date': document?.endDate?.toLocaleDateString(),
        Preview: [document.id, document.fileUrl],
        Share: [document.id, document.name, document.type],
        Delete: [document]
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
