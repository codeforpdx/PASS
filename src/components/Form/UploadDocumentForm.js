import { useReducer } from "react";
import { useSession } from "@inrupt/solid-ui-react";
import { useField } from "../../hooks";
import { handleFiles, runNotification } from "../../utils";
import DocumentSelection from "./DocumentSelection";
import StatusNotification from "./StatusNotification";

/**
 * @typedef uploadReducerObject
 * @property {Object|null} file - An object containing file information and file
 * @property {string} message - File status message
 * @property {string|null} timeoutID - timeoutID for status message
 */

/**
 * @memberof Forms
 * @function uploadReducer
 * @param {uploadReducerObject} state - State for file upload and status message
 * @param {Object} action - useReducer Object for useReducer hook containing action.payload
 * @return {uploadReducerObject} An updated state based on useReducer action
 */

const uploadReducer = (state, action) => {
  switch (action.type) {
    case "SET_FILE":
      return { ...state, file: action.payload };
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "SET_TIMEOUTID":
      return { ...state, timeoutID: action.payload };
    default:
      throw new Error("No action");
  }
};

const UploadDocumentForm = () => {
  const { session } = useSession();
  // Combined state for file upload with useReducer
  const [state, dispatch] = useReducer(uploadReducer, {
    file: null,
    message: "",
    timeoutID: null,
  });

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
  const handleFormSubmission = (event) => {
    event.preventDefault();
    const fileObject = {
      type: event.target.document.value,
      date: event.target.date.value || "01/01/1800",
      description: event.target.description.value || "No Description provided",
      file: state.file,
    };
    try {
      handleFiles(fileObject, session);
      runNotification(
        `Uploading "${fileObject.file.name}" to Solid`,
        2,
        state.timeoutID,
        dispatch
      );
      // setTimeout is used to let handleFiles finish its upload to user's Pod
      setTimeout(() => {
        runNotification(
          `File "${fileObject.file.name}" uploaded to Solid`,
          7,
          state.timeoutID,
          dispatch
        );
        event.target.file.value = null;
        dispatch({ type: "SET_FILE", payload: null });
        clearDescription();
      }, 2000);
    } catch (error) {
      runNotification(
        `Submission failed. Reason: missing file`,
        7,
        state.timeoutID,
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
