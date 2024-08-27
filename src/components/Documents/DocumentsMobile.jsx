// React Import
import React from 'react';

// Material UI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Material UI Styling
import { useTheme } from '@mui/material/styles';

// Component Import
import DocumentCard from './DocumentCard';

/**
 * @typedef {object} Document
 * @property {string} id - The unique id of the document
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
 * DocumentsMobile - A component designed to display a list of documents
 * in a mobile-friendly layout using `DocumentCard` components.
 *
 * @memberof Documents
 * @name DocumentsMobile
 * @param {object} props - Component props
 * @param {Document[]} props.documents - An array of document objects to be displayed
 * @param {Handlers} props.handlers - An object containing handler functions for document actions (preview, share, delete)
 * @returns {React.JSX.Element} The DocumentsMobile component
 */
const DocumentsMobile = ({ documents, handlers }) => {
  const theme = useTheme();

  // Styling for the parent container of the document list
  const tableHeaderStyling = {
    display: 'flex',
    justifyContent: 'space-between' // Arrange child elements with space between them
  };

  return (
    <Box>
      {/* Header section with "Document" and "Actions" labels */}
      <Box
        sx={{
          my: '15px', // Margin top and bottom: 15px
          p: '15px', // Padding: 15px
          background: theme.palette.primary.main, // Background color from theme
          color: '#fff',
          borderRadius: '8px',
          position: 'relative'
        }}
      >
        <Box sx={tableHeaderStyling}>
          {/* Apply the tableHeaderStyling */}
          <Typography
            sx={{
              justifyContent: 'flex-start' // Align 'Document' header to the left
            }}
          >
            Document
          </Typography>
          <Typography
            sx={{
              justifyContent: 'flex-end', // Align 'Actions' header to the right
              maxWidth: '54px',
              marginRight: '0'
            }}
          >
            Actions
          </Typography>
        </Box>
      </Box>

      {/* Map through the documents array and render a `DocumentCard` for each */}
      {documents.map((document) => (
        <DocumentCard
          key={document.id} // Unique key for each card
          document={document} // Pass the document data to the card
          onShare={() => handlers.onShare('document', document.name, document.type)} // Share handler
          onDelete={() => handlers.onDelete(document)} // Delete handler
          onPreview={() => handlers.onPreview(document.fileUrl)} // Preview handler
        />
      ))}
    </Box>
  );
};

export default DocumentsMobile;
