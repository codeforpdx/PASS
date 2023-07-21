// React Imports
import React, { createContext, useState, useMemo, useEffect, useContext } from 'react';
// Inrupt Imports
import { createSolidDataset } from '@inrupt/solid-client';
// Custom Hook Imports
import { useSession } from '@hooks';
// Context Imports
import { SignedInUserContext } from './SignedInUserContext';
import { addDocument, removeDocument, replaceDocument, loadDocumentList } from '../model-helpers';

/**
 * React Context for showing all documents in a user's pod
 *
 * @name UserListContext
 * @memberof contexts
 */
export const UserDocumentListContext = createContext([]);

/**
 * The Provider for UserDocumentListContext
 *
 * @memberof contexts
 * @function UserDocumentListContextProvider
 * @param {React.JSX.Element} children - consumers of UserDocumentListContext
 * @returns {React.JSX.Element}
 * Context from Provider
 */
export const UserDocumentListContextProvider = ({ children }) => {
  const [documentListObject, setDocumentListObject] = useState({});
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const { podUrl } = useContext(SignedInUserContext);
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
      setDocumentListObject({
        docList: [],
        dataset: createSolidDataset(),
        containerUrl: `${podUrl}PASS/Documents/`
      });
      try {
        setDocumentListObject(await loadDocumentList(session, podUrl));
      } finally {
        setLoadingDocuments(false);
      }
    };

    if (podUrl) loadDocuments();
  }, [podUrl]);

  return (
    <UserDocumentListContext.Provider value={documentListMemo}>
      {children}
    </UserDocumentListContext.Provider>
  );
};
