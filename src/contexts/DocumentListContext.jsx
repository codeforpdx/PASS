// React Imports
import React, { createContext, useState, useMemo, useEffect, useContext } from 'react';
// Inrupt Imports
import { createSolidDataset } from '@inrupt/solid-client';
// Custom Hook Imports
import { useSession } from '@hooks';
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
  const [client, setClient] = useState(null);
  const { session } = useSession();

  const documentListMemo = useMemo(
    () => ({
      documentListObject,
      client,
      setClient,
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
        containerUrl: client ? `${client.podUrl}PASS/Documents/` : `${podUrl}PASS/Documents/`
      });
      try {
        setDocumentListObject(await loadDocumentList(session, client ? client.podUrl : podUrl));
      } finally {
        setLoadingDocuments(false);
      }
    };

    if (podUrl) loadDocuments();
  }, [podUrl, client?.podUrl]);

  return (
    <DocumentListContext.Provider value={documentListMemo}>{children}</DocumentListContext.Provider>
  );
};
