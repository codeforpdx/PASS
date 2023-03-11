import React from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { fetchDocuments, runNotification } from '../../utils';
import { useStatusNotification } from '../../hooks';
import DocumentSelection from './DocumentSelection';
import StatusNotification from './StatusNotification';

const FetchDocumentForm = () => {
	const { session } = useSession();
	// Combined state for file upload with useReducer
	const { state, dispatch } = useStatusNotification();

	// Event handler for fetching document
	const handleGetDocumentSubmission = async (event) => {
		event.preventDefault();
		try {
			const documentUrl = await fetchDocuments(session, event.target.document.value);
			if (state.documentLocation) {
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
		<section hidden={!session.info.isLoggedIn ? 'hidden' : ''} className="panel">
			<strong>Search Document</strong>
			<form onSubmit={handleGetDocumentSubmission}>
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
				locationUrl={state.documentLocation}
			/>
		</section>
	);
};

export default FetchDocumentForm;
