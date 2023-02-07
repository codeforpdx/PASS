import { useContext, useState } from "react";
import { SessionContext } from "../../App";
import { useField } from "../../hooks";
import { handleFiles } from "../../utils/session-helper";
import StatusNotification from "./StatusNotification";

const DocumentOption = ({ docType }) => {
  return <option>{docType}</option>;
};

const WriteForm = () => {
  const { session } = useContext(SessionContext);

  // Initalized state for file upload
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const docOptions = ["Bank Statement", "Passport", "Drivers License"];

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

  // main form handler for form submission
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
      handleUploadMessage(`File "${fileObject.file.name}" uploaded to solid`);
      event.target.file.value = null;
      clearDescription();
    } catch (error) {
      handleUploadMessage(`Submission failed. Reason: missing file`);
    }
  };

  const handleUploadMessage = (message) => {
    setTimeout(() => {
      setFileUploaded({
        state: false,
        message: "",
      });
    }, 7000);
    setFileUploaded((prevState) => {
      return {
        state: !prevState.state,
        message,
      };
    });
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
          <form id="writeForm" onSubmit={handleFormSubmission}>
            <label htmlFor="cars">Choose Document Type To Upload: </label>
            <select name="document" id="document">
              {docOptions.map((docType, index) => {
                return <DocumentOption key={index} docType={docType} />;
              })}
            </select>
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

export default WriteForm;
