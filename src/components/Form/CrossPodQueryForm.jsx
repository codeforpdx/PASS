import React, { useContext } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { fetchDocuments, runNotification } from '../../utils';
import { useStatusNotification } from '../../hooks';
import DocumentSelection from './DocumentSelection';
import FormSection from './FormSection';
import SelectUserContext from '../../contexts/selectUserContext';

/**
 * CrossPodQueryForm Component - Component that generates the form for cross pod
 * search for a specific document from another user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name CrossPodQueryForm
 */

const CrossPodQueryForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const { selectedUser } = useContext(SelectUserContext);

  // Event handler for Cross Pod Querying/Searching
  const handleCrossPodQuery = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const docType = event.target.document.value;
    const podUrl = selectedUser;

    if (!podUrl) {
      runNotification('Search failed. Reason: Pod URL not provided.', 3, state, dispatch);
      dispatch({ type: 'CLEAR_PROCESSING' });
      return;
    }

    try {
      const documentUrl = await fetchDocuments(session, docType, 'cross-fetch', podUrl);

      if (state.documentUrl) {
        dispatch({ type: 'CLEAR_DOCUMENT_LOCATION' });
      }

      runNotification('Locating document...', 3, state, dispatch);

      // setTimeout is used to let fetchDocuments complete its fetch
      setTimeout(() => {
        dispatch({ type: 'SET_DOCUMENT_LOCATION', payload: documentUrl });
        runNotification('Document found! Document located at: ', 3, state, dispatch);
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
    } catch (_error) {
      dispatch({ type: 'CLEAR_DOCUMENT_LOCATION' });
      runNotification('Search failed. Reason: Document not found.', 3, state, dispatch);
      dispatch({ type: 'CLEAR_PROCESSING' });
    }
  };

  const formRowStyle = {
    margin: '20px 0'
  };

  return (
    <FormSection
      title="Cross Pod Search"
      state={state}
      statusType="Search status"
      defaultMessage="To be searched..."
    >
      <form onSubmit={handleCrossPodQuery} autoComplete="off">
        <div style={formRowStyle}>
          <p>
            Search document from: <em>{selectedUser}</em>
          </p>
        </div>
        <div style={formRowStyle}>
          <label htmlFor="cross-search-doctype">Select document type to search: </label>
          <DocumentSelection htmlId="cross-search-doctype" />{' '}
          <button disabled={state.processing} type="submit">
            Search Pod
          </button>
        </div>
      </form>
    </FormSection>
  );
};

export default CrossPodQueryForm;
