// React Import
import React from 'react';

// Material UI Icon Imports
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ShareIcon from '@mui/icons-material/Share';
import FileOpenIcon from '@mui/icons-material/FileOpen';

// Material UI DataGrid Imports
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton
} from '@mui/x-data-grid';

// Util Imports
import { getTypeText } from '@utils'; // Import utility function for getting formatted document type text

// Theme Imports
import theme from '../../theme';

// Custom toolbar for the DataGrid
const CustomToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarFilterButton /> {/* Add a filter button to the toolbar */}
    <GridToolbarDensitySelector /> {/* Add a density selector to the toolbar */}
  </GridToolbarContainer>
);

/**
 * @typedef {object} Document
 * @property {string} id - The unique id of the document
 * @property {string} name - The name of the document
 * @property {string} type - The type of the document
 * @property {string} description - A brief description of the document
 * @property {string} uploadDate- The date when the document was uploaded
 * @property {string} endDate - The expiration date of the document (if applicable)
 * @property {string} fileUrl - The URL where the document file is located
 */

/**
 * @typedef {object} Handlers
 * @property {Function} onPreview - Function to handle document previewing.
 * @property {Function} onShare - Function to handle document sharing.
 * @property {Function} onDelete - Function to handle document deletion.
 */

/**
 * DocumentsDesktop - A component that displays a list of documents in a tabular
 * format (DataGrid) suitable for desktop screens. It provides actions like
 * preview, share, and delete for each document.
 *
 * @memberof Documents
 * @name DocumentsDesktop
 * @param {object} props - Component props
 * @param {Document[]} props.documents - An array of document objects to be displayed
 * @param {Handlers} props.handlers - An object containing handler functions for document actions
 * @returns {React.JSX.Element} The DocumentsDesktop component
 */
const DocumentsDesktop = ({ documents, handlers }) => {
  // Define the columns for the DataGrid
  const columnTitlesArray = [
    { field: 'Name', minWidth: 120, flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'Type', minWidth: 120, flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'Description', minWidth: 120, flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'Upload Date', minWidth: 120, flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'Expiration Date', minWidth: 120, flex: 1, headerAlign: 'center', align: 'center' },
    {
      field: 'Preview',
      minWidth: 100,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false, // Disable sorting for this column
      filterable: false, // Disable filtering for this column
      // Render a "Preview" button in each row's cell
      renderCell: (data) => {
        const [id, fileUrl] = data.value;
        return (
          <GridActionsCellItem // A clickable cell item with an icon and label
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
        const [id, name, type] = data.value;
        return (
          <GridActionsCellItem
            key={`Share:${String(id)}`}
            icon={<ShareIcon />}
            onClick={() => handlers.onShare('document', name, type)}
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
      // Render a "Delete" button in each row's cell
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

  // Render the DataGrid if there are documents to display
  return (
    <DataGrid
      columns={columnTitlesArray} // Use the defined columns
      rows={documents.map((document) => ({
        // Map document data to row data format expected by DataGrid
        id: document.id,
        Name: document.name,
        Type: getTypeText(document.type),
        Description: document.description || '[Not Provided]',
        'Upload Date': document?.uploadDate.toLocaleDateString(),
        'Expiration Date': document?.endDate?.toLocaleDateString() || '[Not Provided]',
        Preview: [document.id, document.fileUrl], // Pass data needed for "Preview" action
        Share: [document.id, document.name, document.type], // Pass data needed for "Share" action
        Delete: [document] // Pass the document object for "Delete" action
      }))}
      pageSizeOptions={[10]} // Allow only 10 rows per page
      initialState={{
        pagination: {
          paginationModel: { pageSize: 10, page: 0 } // Start with 10 rows on the first page
        }
      }}
      slots={{
        toolbar: CustomToolbar // Use the custom toolbar
      }}
      sx={{
        // Apply styling to the DataGrid using Material-UI's `sx` prop
        '.MuiDataGrid-columnHeader': {
          background: theme.palette.primary.light,
          color: 'white'
        },
        '.MuiDataGrid-columnSeparator': {
          display: 'none'
        }
      }}
      disableColumnMenu // Disable the default column menu
      disableRowSelectionOnClick // Prevent row selection on click
    />
  );
};

export default DocumentsDesktop;
