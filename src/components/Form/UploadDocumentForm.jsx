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
    } else {
      dispatch({
        type: "CLEAR_FILE",
      });
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

    if (!state.file) {
      runNotification(
        `Submission failed. Reason: missing file`,
        7,
        state,
        dispatch
      );
      console.log("Submission failed. Reason: missing file");
      return;
    }

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
        setTimeout(() => {
          dispatch({ type: "CLEAR_FILE" });
          event.target.file.value = "";
          clearDescription();
        }, 7000);
      }, 2000);
    } catch (_error) {
      dispatch({ type: "CLEAR_FILE" });
      event.target.file.value = "";
      clearDescription();
      runNotification(
        `Submission failed. Reason: Previous file has already been saved to this type`,
        7,
        state,
        dispatch
      );
      console.log(
        "Submission failed. Reason: Previous file has already been saved to this type"
      );
    }
  };

  const formRowStyle = {
    margin: "20px 0",
  };

  return (
    <section
      hidden={!session.info.isLoggedIn ? "hidden" : ""}
      className="panel"
    >
      <strong>Upload Document</strong>
      <form onSubmit={handleFormSubmission}>
        <div style={formRowStyle}>
          <label htmlFor="upload-doc">Select document type to upload: </label>
          <DocumentSelection htmlId="upload-doc" />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="upload-doc-expiration">
            Expiration date (if applicable):{" "}
          </label>
          <input id="upload-doc-expiration" name="date" type="date" />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="upload-doc-desc">Enter description: </label>
          <br />
          <br />
          <textarea id="upload-doc-desc" name="description" {...description} />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="upload-doctype">File to upload: </label>
          <input
            id="upload-doctype"
            type="file"
            name="file"
            accept=".pdf, .docx., .doc, .txt, .rtf"
            onChange={handleFileChange}
          />
          <button type="submit">Upload file</button>
          <button style={{ marginLeft: "5px" }} type="reset">
            Reset file submission
          </button>
        </div>
      </form>
      <StatusNotification
        notification={state.message}
        statusType="Writing status"
        defaultMessage="To be uploaded..."
      />
    </section>
  );
};

export default UploadDocumentForm;
