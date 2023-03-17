import React from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { fetchDocuments, runNotification } from '../../utils';
import { useStatusNotification } from '../../hooks';
import { StatusNotification } from '../Notification';
import DocumentSelection from './DocumentSelection';

/**
 * FetchDocumentForm Component - Component that generates the form for searching
 * a specific document type from a user's Solid Pod via Solid Session
 * @memberof Forms
 * @component
 * @name FetchDocumentForm
 */

const FetchDocumentForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();

  // Event handler for searching/fetching document
  const handleGetDocumentSubmission = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const docType = event.target.document.value;

    try {
      const documentUrl = await fetchDocuments(session, docType, 'self-fetch');

      if (state.documentUrl) {
        dispatch({ type: 'CLEAR_DOCUMENT_LOCATION' });
      }

      runNotification('Locating document...', 3, state, dispatch);

      // setTimeout is used to let fetchDocuments complete its fetch
      setTimeout(() => {
        dispatch({ type: 'SET_DOCUMENT_LOCATION', payload: documentUrl });
        runNotification('Document found! Document located at: ', 7, state, dispatch);
      }, 3000);
    } catch (_error) {
      dispatch({ type: 'CLEAR_DOCUMENT_LOCATION' });
      runNotification('Search failed. Reason: Document not found', 3, state, dispatch);
    }
  };

  const formRowStyle = {
    margin: '20px 0'
  };

  return (
    <section className="panel">
      <strong>Search Document</strong>
      <form onSubmit={handleGetDocumentSubmission} autoComplete="off">
        <div style={formRowStyle}>
          <label htmlFor="search-doctype">Select document type to search: </label>
          <DocumentSelection htmlId="search-doctype" />{' '}
          <button disabled={state.processing} type="submit">
            Get Document
          </button>
        </div>
      </form>
      <StatusNotification
        notification={state.message}
        statusType="Search status"
        defaultMessage="To be searched..."
        locationUrl={state.documentUrl}
      />
    </section>
  );
};

export default FetchDocumentForm;
