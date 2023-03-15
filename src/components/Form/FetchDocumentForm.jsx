import React from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { fetchDocuments, runNotification } from '../../utils';
import { useStatusNotification } from '../../hooks';
import { StatusNotification } from '../Notification';
import DocumentSelection from './DocumentSelection';

/**
 * FetchDocumentForm Component - Component that generates the form for searching a specific document type from a user's Solid Pod via Solid Session
 * @memberof Forms
 * @component
 * @name FetchDocumentForm
 */

const FetchDocumentForm = () => {
  const { session } = useSession();
  // Combined state for file upload with useReducer
  const { state, dispatch } = useStatusNotification();

  // Event handler for fetching document
  const handleGetDocumentSubmission = async (event) => {
    event.preventDefault();
    try {
      const documentUrl = await fetchDocuments(session, event.target.document.value, 'self-fetch');

      if (state.documentUrl) {
        dispatch({ type: 'CLEAR_DOCUMENT_LOCATION' });
      }

      runNotification(`Locating document...`, 2, state, dispatch);

      // setTimeout is used to let fetchDocuments complete its fetch
      setTimeout(() => {
        dispatch({ type: 'SET_DOCUMENT_LOCATION', payload: documentUrl });
        runNotification(`Document found! Document located at: `, 7, state, dispatch);
      }, 2000);
    } catch (_error) {
      dispatch({ type: 'CLEAR_DOCUMENT_LOCATION' });
      runNotification(`Search failed. Reason: Document not found`, 7, state, dispatch);

      console.log('Search failed. Reason: Document not found');
    }
  };

  const formRowStyle = {
    margin: '20px 0'
  };

  return (
    <section className="panel">
      <div className="col s6">
        <div className="card horizontal">
          <div className="card-stacked">
            <div className="card-content">
              <div className="section no-pad-bot row center">
                <h5>
                  <strong>Search Document</strong>
                </h5>
                <form onSubmit={handleGetDocumentSubmission} autoComplete="off">
                  <div style={formRowStyle}>
                    <label htmlFor="search-doctype">Select document type to search: </label>
                    <DocumentSelection htmlId="search-doctype" />{' '}
                    <button type="submit">Get Document</button>
                  </div>
                </form>
                <StatusNotification
                  notification={state.message}
                  statusType="Search status"
                  defaultMessage="To be searched..."
                  locationUrl={state.documentUrl}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FetchDocumentForm;
