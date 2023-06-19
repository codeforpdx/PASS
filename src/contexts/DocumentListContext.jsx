// React Imports
import React, { createContext, useState, useMemo, useEffect, useContext } from 'react';
import { createSolidDataset } from '@inrupt/solid-client';
// Inrupt Imports
import { useSession } from '@inrupt/solid-ui-react';

// Context Imports
import { SelectedUserContext } from './SelectedUserContext';
import { addDocument, removeDocument, replaceDocument, loadDocumentList } from '../model-helpers';

/**
 * React Context for users list from Solid Pod
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
 * @param {React.JSX.Element} children - The wrapped components that consumes
 * @returns {React.JSX.Element}
 * Context from Provider
 */
export const DocumentListContextProvider = ({ children }) => {
  const [documentListObject, setDocumentListObject] = useState({});
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const { selectedUser } = useContext(SelectedUserContext);
  const { session } = useSession();

  const documentListMemo = useMemo(
    () => ({
      documentListObject,
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
      setDocumentListObject( {
        docList: [],
        dataset: createSolidDataset(),
        containerUrl: `${selectedUser.podUrl}PASS/Documents/`
      } )
      try {
        setDocumentListObject(await loadDocumentList(session, selectedUser.podUrl));
      } finally {
        setLoadingDocuments(false);
      }
    };

    if (selectedUser) loadDocuments();
  }, [selectedUser]);

  return (
    <DocumentListContext.Provider value={documentListMemo}>{children}</DocumentListContext.Provider>
  );
};
