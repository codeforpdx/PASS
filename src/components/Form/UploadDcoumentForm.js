import { useContext, useState } from "react";
import { SessionContext } from "../../App";
import { useField } from "../../hooks";
import { handleFiles } from "../../utils/session-helper";
import { runNotification } from "../../utils/notification-helper";
import DocumentSelection from "./DocumentSelection";
import StatusNotification from "./StatusNotification";

const UploadDocumentForm = () => {
  const { session } = useContext(SessionContext);

  // Initalized state for file upload
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  // Custom useField hook for handling form inputs
  const {
    clearValue: clearDescription,
    _type,
    ...description
  } = useField("textarea");

  // useState for upload notification
  const [fileUploaded, setFileUploaded] = useState({
    state: false,
    message: "",
  });
  const [timeoutID, setTimeoutID] = useState(null);

  // Event handler for form/document submission to Pod
  const handleFormSubmission = (event) => {
    event.preventDefault();
    const fileObject = {
      type: event.target.document.value,
      date: event.target.date.value || "01/01/1800",
      description: event.target.description.value || "No Description provided",
      file: file,
    };
    try {
      handleFiles(fileObject, session);
      runNotification(
        `File "${fileObject.file.name}" uploaded to solid`,
        7,
        timeoutID,
        setFileUploaded,
        setTimeoutID
      );
      event.target.file.value = null;
      clearDescription();
    } catch (error) {
      runNotification(
        `Submission failed. Reason: missing file`,
        7,
        timeoutID,
        setFileUploaded,
        setTimeoutID
      );
    }
  };

  return (
    <>
      <div
        hidden={!session.info.isLoggedIn ? "hidden" : ""}
        id="write"
        className="panel"
      >
        <div className="row">
          <strong>Upload Document</strong>
          <br />
          <br />
          <form id="upload-document" onSubmit={handleFormSubmission}>
            <label htmlFor="cars">Choose Document Type To Upload: </label>
            <DocumentSelection />
            <br />
            <p>Expiration Date (if applicable):</p>
            <input name="date" id="date" type="date" />
            <br />
            <p>Enter Description:</p>
            <textarea name="description" id="description" {...description} />
            <br />
            <br />
            <label id="writelabel" htmlFor="input_file"></label>
            <input
              type="file"
              id="input_file"
              name="file"
              accept=".pdf, .docx., .doc, .txt, .rtf"
              onChange={handleFileChange}
            />
            <button type="submit">Upload file</button>
          </form>
        </div>
        <StatusNotification
          notification={fileUploaded}
          statusType="Writing Status"
          defaultMessage="To be uploaded..."
        />
      </div>
    </>
  );
};

export default UploadDocumentForm;
