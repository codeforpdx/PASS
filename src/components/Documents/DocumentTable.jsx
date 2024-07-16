// React Imports
import React, { useContext } from 'react';
// Constants
import DOC_TYPES from '@constants/doc_types';
// Material UI Imports
import { useMediaQuery } from '@mui/material';

// Context Imports
import { DocumentListContext } from '@contexts';
import { useSession } from '@hooks';
// Utility Imports
import { getBlobFromSolid } from '@utils';
// Theme Imports
import theme from '../../theme';
// Component Imports
import { EmptyListNotification, LoadingAnimation } from '../Notification';

import DocumentsMobile from './DocumentsMobile';
import DocumentsDesktop from './DocumentsDesktop';

/**
 * DocumentTable - Component that shows the list of documents
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

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  // Updates type value to use DOC_TYPES for formatting the string
  const mappingType = (type) => DOC_TYPES[type] || type;

  // Map types for each document in the array
  const documents = documentListObject?.docList.map((document) => ({
    ...document,
    type: mappingType(document.type)
  }));

  const handlers = {
    onShare: handleAclPermissionsModal,
    onDelete: handleSelectDeleteDoc,
    onPreview: handleShowDocumentLocal
  };

  if (!documents?.length) return <EmptyListNotification type="documents" />;
  if (loadingDocuments) return <LoadingAnimation loadingItem="documents" />;
  return isMobile ? (
    <DocumentsMobile documents={documents} handlers={handlers} />
  ) : (
    <DocumentsDesktop documents={documents} handlers={handlers} />
  );
};

export default DocumentTable;
