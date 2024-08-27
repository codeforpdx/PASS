// React Imports
import React, { useContext, useMemo } from 'react'; // Used to optimally track and respond to document changes
import { v4 as uuidv4 } from 'uuid'; // Used to generate a unique ID for each document

// Constants
// Import document type constants for mapping and display purposes
import DOC_TYPES from '@constants/doc_types';

// Material UI Imports
import Box from '@mui/material/Box';
import { useMediaQuery } from '@mui/material';

// Context Imports
// Import the `DocumentListContext` to access the document list and loading state
import { DocumentListContext } from '@contexts';
// Import the `useSession` hook to get the current Solid session
import { useSession } from '@hooks';

// Utility Imports
// Import the `getBlobFromSolid` utility to fetch document data from Solid
import { getBlobFromSolid } from '@utils';

// Theme Imports
// Import the application's theme for styling purposes
import theme from '../../theme';

// Component Imports
// Import notification components for empty list and loading states
import { EmptyListNotification, LoadingAnimation } from '../Notification';
// Import components for rendering documents on mobile and desktop
import DocumentsMobile from './DocumentsMobile';
import DocumentsDesktop from './DocumentsDesktop';

/**
 * DocumentTable - A component responsible for rendering a list of documents
 * fetched from a Solid pod. It adapts its rendering based on the screen size
 * (mobile or desktop) using the `DocumentsMobile` and `DocumentsDesktop`
 * components.
 *
 * @memberof Documents
 * @name DocumentTable
 * @param {object} props - Component props
 * @param {(modalType: string, docName: string, docType: string) => void} props.handleAclPermissionsModal - Function to open the ACL permissions modal
 * @param {(document: object) => void} props.handleSelectDeleteDoc - Function to handle document deletion
 * @returns {React.JSX.Element} The DocumentTable component
 */
const DocumentTable = ({ handleAclPermissionsModal, handleSelectDeleteDoc }) => {
  // Get the current Solid session using the `useSession` hook
  const { session } = useSession();
  // Retrieve the document list and loading state from the `DocumentListContext`
  const { documentListObject, loadingDocuments } = useContext(DocumentListContext);

  // Determine if the screen size is mobile using Material-UI's `useMediaQuery`
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /**
   * Handles the local display of a document by opening it in a new window.
   *
   * @async
   * @function
   * @param {string} urlToOpen - The URL of the document to be opened.
   * @throws {Error} Throws an error if there is an issue fetching the document blob.
   * @returns {Promise<void>} A promise that resolves after the document is opened.
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

    // Open a new window to display the document using the blob URL
    window.open(urlFileBlob);
  };

  // Maps raw document types to user-friendly display names using `DOC_TYPES`
  const mappingType = (type) => DOC_TYPES[type] || type;

  // Processes the document list, adding unique IDs and mapping types
  const documents = useMemo(
    () =>
      documentListObject?.docList.map((document) => ({
        id: uuidv4(), // Generate a unique ID for each document
        type: mappingType(document.type), // Map the document type
        ...document // Include all other document properties
      })),
    [documentListObject?.docList] // Re-compute only when the document list changes
  );

  // An object containing event handler functions for document actions
  const handlers = {
    onShare: handleAclPermissionsModal,
    onDelete: handleSelectDeleteDoc,
    onPreview: handleShowDocumentLocal
  };

  // Render a notification if there are no documents
  if (!documents?.length) return <EmptyListNotification type="documents" />;

  // Render a loading animation while documents are being fetched
  if (loadingDocuments) return <LoadingAnimation loadingItem="documents" />;

  // Render the document list based on screen size (mobile or desktop)
  return (
    <Box
      sx={{
        margin: '20px 0',
        width: '95vw',
        height: '500px'
      }}
    >
      {isMobile ? (
        <DocumentsMobile documents={documents} handlers={handlers} />
      ) : (
        <DocumentsDesktop documents={documents} handlers={handlers} />
      )}
    </Box>
  );
};

export default DocumentTable;
