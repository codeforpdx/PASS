import { useSession } from "@inrupt/solid-ui-react";
import { useField, useStatusNotification } from "../../hooks";
import { uploadDocument, runNotification } from "../../utils";
import DocumentSelection from "./DocumentSelection";
import StatusNotification from "./StatusNotification";

const UploadDocumentForm = () => {
  const { session } = useSession();
  // Combined state for file upload with useReducer
  const { state, dispatch } = useStatusNotification();

  // Initalized state for file upload
  const handleFileChange = (event) => {
    if (event.target.files) {
      dispatch({
        type: "SET_FILE",
        payload: event.target.files[0],
      });
    }
  };

  // Custom useField hook for handling form inputs
  const {
    clearValue: clearDescription,
    _type,
    ...description
  } = useField("textarea");

  // Event handler for form/document submission to Pod
  const handleFormSubmission = async (event) => {
    event.preventDefault();
    const fileObject = {
      type: event.target.document.value,
      date: event.target.date.value || "01/01/1800",
      description: event.target.description.value || "No Description provided",
      file: state.file,
    };

    try {
      await uploadDocument(fileObject, session);
      runNotification(
        `Uploading "${fileObject.file.name}" to Solid`,
        2,
        state,
        dispatch
      );
      // setTimeout is used to let uploadDocument finish its upload to user's Pod
      setTimeout(() => {
        runNotification(
          `File "${fileObject.file.name}" uploaded to Solid`,
          7,
          state,
          dispatch
        );
        event.target.file.value = null;
        dispatch({ type: "CLEAR_FILE" });
        clearDescription();
      }, 2000);
    } catch (error) {
      runNotification(
        `Submission failed. Reason: missing file`,
        7,
        state,
        dispatch
      );
    }
  };

  const formRowStyle = {
    margin: "20px 0",
  };

  return (
    <div hidden={!session.info.isLoggedIn ? "hidden" : ""} className="panel">
      <strong>Upload Document</strong>
      <form onSubmit={handleFormSubmission}>
        <div style={formRowStyle}>
          <label>Select document type to upload: </label>
          <DocumentSelection />
        </div>
        <div style={formRowStyle}>
          <label>Expiration date (if applicable): </label>
          <input name="date" type="date" />
        </div>
        <div style={formRowStyle}>
          <label>Enter description: </label>
          <br />
          <br />
          <textarea name="description" {...description} />
        </div>
        <div style={formRowStyle}>
          <label>File to upload: </label>
          <input
            type="file"
            name="file"
            accept=".pdf, .docx., .doc, .txt, .rtf"
            onChange={handleFileChange}
          />
          <button type="submit">Upload file</button>
        </div>
      </form>
      <StatusNotification
        notification={state.message}
        statusType="Writing status"
        defaultMessage="To be uploaded..."
      />
    </div>
  );
};

export default UploadDocumentForm;
