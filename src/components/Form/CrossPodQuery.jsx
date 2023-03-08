import React from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import StatusNotification from './StatusNotification';
import DocumentSelection from './DocumentSelection';

const CrossPodQuery = () => {
	const { session } = useSession();

	const handleCrossPodQuery = (event) => {
		event.preventDefault();
		// dummy calls for now
		console.log(event.target.crossPodQuery.value);
		console.log(event.target.document.value);
	};

	const formRowStyle = {
		margin: '20px 0'
	};

	return (
		<section hidden={!session.info.isLoggedIn ? 'hidden' : ''} className="panel">
			<strong>Cross Pod Search</strong>
			<form onSubmit={handleCrossPodQuery}>
				<div style={formRowStyle}>
					<label htmlFor="cross-search-doc">
						Paste other user&apos;s pod url to search from:{' '}
					</label>
					<input id="cross-search-doc" size="60" type="text" name="crossPodQuery" />
				</div>
				<div style={formRowStyle}>
					<label htmlFor="cross-search-doctype">Select document type to search: </label>
					<DocumentSelection htmlId="cross-search-doctype" />{' '}
					<button type="submit">Search Pod</button>
				</div>
			</form>
			<StatusNotification
				notification=""
				statusType="Writing status"
				defaultMessage="To be searched..."
			/>
		</section>
	);
};

export default CrossPodQuery;
