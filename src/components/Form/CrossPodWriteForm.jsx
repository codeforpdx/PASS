import React, { useState } from 'react';
import { useField } from '../../hooks';
import StatusNotification from './StatusNotification';
import DocumentSelection from './DocumentSelection';

/**
 * CrossPodWriteForm Component - Component that generates the form for cross pod uploading for specific document to other user's Solid Pod via Solid Session
 * @memberof Forms
 * @component
 * @name CrossPodWriteForm
 * @returns {void}
 */

const CrossPodWriteForm = () => {
  const { clearValue: clearDescription, _type, ...description } = useField('textarea');
  const [file, setFile] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleCrossPodUpload = (event) => {
    event.preventDefault();
    // dummy calls for now
    console.log(event.target.crossPodUpload.value);
    console.log(event.target.document.value);
    console.log(event.target.date.value);
    console.log(event.target.description.value);
    console.log(file);
  };

  const formRowStyle = {
    margin: '20px 0'
  };

  return (
    <section className="panel">
      <strong>Cross Pod Upload</strong>
      <form onSubmit={handleCrossPodUpload} autoComplete="off">
        <div style={formRowStyle}>
          <label htmlFor="cross-upload-doc">
            Please input a user's Pod URL you wish to upload to:{' '}
          </label>
          <input id="cross-upload-doc" size="60" type="text" name="crossPodUpload" />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="cross-upload-doctype">Choose document type to upload: </label>
          <DocumentSelection htmlId="cross-upload-doctype" />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="cross-upload-doc-expiration">Expiration date (if applicable): </label>
          <input id="cross-upload-doc-expiration" name="date" type="date" />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="cross-upload-doc-desc">Enter description:</label>
          <br />
          <br />
          <textarea id="cross-upload-doc-desc" name="description" {...description} />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="cross-upload-doctype">File to upload: </label>
          <input
            id="cross-upload-doctype"
            type="file"
            name="file"
            accept=".pdf, .docx., .doc, .txt, .rtf"
            onChange={handleFileChange}
          />
          <button type="submit">Upload to Pod</button>
        </div>
      </form>
      <StatusNotification
        notification=""
        statusType="Writing status"
        defaultMessage="To be uploaded..."
      />
    </section>
  );
};

export default CrossPodWriteForm;
