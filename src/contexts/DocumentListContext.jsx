// React Imports
import React, { createContext, useState, useMemo, useEffect, useContext } from 'react';
// Inrupt Imports
import { createSolidDataset } from '@inrupt/solid-client';
// Custom Hook Imports
import { SessionContext } from './SessionContext';
// Model Imports
import { addDocument, removeDocument, replaceDocument, loadDocumentList } from '../model-helpers';
// Context Imports
import { SignedInUserContext } from './SignedInUserContext';

/**
 * React Context for showing all documents in a user's pod
 *
 * @name UserListContext
 * @memberof contexts
 */
export const DocumentListContext = createContext([]);

/**
 * The Provider for DocumentListContext
 *
 * @memberof contexts
 * @function DocumentListContextProvider
 * @param {React.JSX.Element} children - consumers of DocumentListContext
 * @returns {React.JSX.Element}
 * Context from Provider
 */
export const DocumentListContextProvider = ({ children }) => {
  const [documentListObject, setDocumentListObject] = useState({});
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const { podUrl } = useContext(SignedInUserContext);
  const [contact, setContact] = useState(null);
  const { session } = useContext(SessionContext);

  const documentListMemo = useMemo(
    () => ({
      documentListObject,
      contact,
      setContact,
      addDocument: async (docDesc, file) =>
        setDocumentListObject(await addDocument(docDesc, file, documentListObject, session)),
      replaceDocument: async (docDesc, file) =>
        setDocumentListObject(await replaceDocument(docDesc, file, documentListObject, session)),
      removeDocument: async (docName) =>
        setDocumentListObject(await removeDocument(docName, documentListObject, session)),
      loadingDocuments
    }),
    [documentListObject, loadingDocuments]
  );

  useEffect(() => {
    const loadDocuments = async () => {
      setDocumentListObject({
        docList: [],
        dataset: createSolidDataset(),
        containerUrl: contact ? `${contact.podUrl}PASS/Documents/` : `${podUrl}PASS/Documents/`
      });
      try {
        setDocumentListObject(await loadDocumentList(session, contact ? contact.podUrl : podUrl));
      } finally {
        setLoadingDocuments(false);
      }
    };

    if (podUrl) loadDocuments();
  }, [podUrl, contact?.podUrl]);

  return (
    <DocumentListContext.Provider value={documentListMemo}>{children}</DocumentListContext.Provider>
  );
};
