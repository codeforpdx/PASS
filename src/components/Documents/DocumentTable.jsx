// React Imports
import React, { useContext } from 'react';
// Constants
import DOC_TYPES from '@constants/doc_types';

// Context Imports
import { DocumentListContext } from '@contexts';
import { useSession } from '@hooks';
// Utility Imports
import { getBlobFromSolid } from '@utils';
// Component Imports
import { EmptyListNotification, LoadingAnimation } from '../Notification';
import DocumentPreview from './DocumentPreview';

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
  const mappedDocuments = documentListObject?.docList.map((document) => ({
    ...document,
    type: mappingType(document.type)
  }));

  const documents = mappedDocuments?.length ? (
    // Render if documents
    mappedDocuments.map((document) => (
      <DocumentPreview
        key={document.id}
        document={document}
        onShare={() => handleAclPermissionsModal('document', document.id, document.type)}
        onRemove={() => handleSelectDeleteDoc(document.delete)}
        onPreview={() => handleShowDocumentLocal(document.fileUrl)}
      />
    ))
  ) : (
    // Render if no documents
    <EmptyListNotification type="documents" />
  );

  // MAIN RETURN OF COMPONENT
  return loadingDocuments ? <LoadingAnimation loadingItem="documents" /> : documents;
};

export default DocumentTable;
