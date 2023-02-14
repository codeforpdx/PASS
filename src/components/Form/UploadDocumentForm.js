import { useContext, useReducer } from "react";
import { SessionContext } from "../../App";
import { useField } from "../../hooks";
import { handleFiles, runNotification } from "../../utils";
import DocumentSelection from "./DocumentSelection";
import StatusNotification from "./StatusNotification";

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
  const { session } = useContext(SessionContext);
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
        `File "${fileObject.file.name}" uploaded to solid`,
        7,
        state.timeoutID,
        dispatch
      );
      event.target.file.value = null;
      dispatch({ type: "SET_FILE", payload: null });
      clearDescription();
    } catch (error) {
      runNotification(
        `Submission failed. Reason: missing file`,
        7,
        state.timeoutID,
        dispatch
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
          notification={state.message}
          statusType="Writing Status"
          defaultMessage="To be uploaded..."
        />
      </div>
    </>
  );
};

export default UploadDocumentForm;
