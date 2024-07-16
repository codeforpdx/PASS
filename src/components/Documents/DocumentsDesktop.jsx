import React from 'react';
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
// Theme Imports
import theme from '../../theme';

// DataGrid Toolbar
const CustomToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarFilterButton />
    <GridToolbarDensitySelector />
  </GridToolbarContainer>
);

const DocumentsDesktop = ({ documents, handlers }) => {
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
          onClick={() => handlers.onPreview(fileUrl)}
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
          onClick={() => handlers.onShare('document', data.row.id, data.row.type)}
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
          onClick={() => handlers.onDelete(data.row.delete)}
          label="Delete"
        />
      ]
    }
  ];
  // Render if documents
  return (
    <Box sx={{ margin: '20px 0', width: '90vw', height: '500px' }}>
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
  );
};

export default DocumentsDesktop;
