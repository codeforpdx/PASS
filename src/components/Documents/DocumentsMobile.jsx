import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useTheme } from '@mui/material/styles';

import DocumentCard from './DocumentCard';

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
 * DocumentsMobile - Component for displaying documents in a DataGrid
 *
 * @memberof Documents
 * @name DocumentsDesktop
 * @param {object} Props - The props for DocumentsMobile
 * @param {Document[]} Props.documents - The list of documents to display
 * @param {Handlers} Props.handlers - Object containing event handler functions.
 * @returns {React.JSX.Element} The DocumentsMobile component
 */
const DocumentsMobile = ({ documents, handlers }) => {
  const theme = useTheme();

  // parent box element
  const tableHeaderStyling = {
    display: 'flex',
    justifyContent: 'space-between'
  };

  return (
    <Box>
      <Box
        sx={{
          my: '15px',
          p: '15px',
          background: theme.palette.primary.main,
          color: '#fff',
          borderRadius: '8px',
          position: 'relative'
        }}
      >
        <Box sx={tableHeaderStyling}>
          <Typography sx={{ marginLeft: '0' }}>Document</Typography>
          <Typography
            sx={{
              justifyContent: 'flex-end',
              maxWidth: '54px',
              marginRight: '0'
            }}
          >
            Actions
          </Typography>
        </Box>
      </Box>
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          onShare={() => handlers.onShare('document', document.name, document.type)}
          onDelete={() => handlers.onDelete(document)}
          onPreview={() => handlers.onPreview(document.fileUrl)}
        />
      ))}
    </Box>
  );
};

export default DocumentsMobile;
