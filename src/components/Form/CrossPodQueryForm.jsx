import React from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { fetchDocuments, runNotification } from '../../utils';
import { useStatusNotification } from '../../hooks';
import { StatusNotification } from '../Notification';
import DocumentSelection from './DocumentSelection';

/**
 * CrossPodQueryForm Component - Component that generates the form for cross pod search for a specific document from another user's Solid Pod via Solid Session
 * @memberof Forms
 * @component
 * @name CrossPodQueryForm
 */

const CrossPodQueryForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();

  // Event handler for Cross Pod Querying/Searching
  const handleCrossPodQuery = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });

    if (!event.target.crossPodQuery.value) {
      runNotification('Search failed. Reason: Pod URL not provided', 3, state, dispatch);
      return;
    }

    try {
      const documentUrl = await fetchDocuments(
        session,
        event.target.document.value,
        'cross-fetch',
        event.target.crossPodQuery.value
      );

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
      <strong>Cross Pod Search</strong>
      <form onSubmit={handleCrossPodQuery} autoComplete="off">
        <div style={formRowStyle}>
          <label htmlFor="cross-search-doc">
            Please input a user's Pod URL you wish to search from (i.e., username.opencommons.net):{' '}
          </label>
          <br />
          <br />
          <input id="cross-search-doc" size="60" type="text" name="crossPodQuery" />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="cross-search-doctype">Select document type to search: </label>
          <DocumentSelection htmlId="cross-search-doctype" />{' '}
          <button disabled={state.processing} type="submit">
            Search Pod
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

export default CrossPodQueryForm;
