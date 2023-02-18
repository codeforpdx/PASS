import { useContext, useState } from "react";
import { useField } from "../../hooks";
import { SessionContext } from "../../App";
import StatusNotification from "./StatusNotification";
import DocumentSelection from "./DocumentSelection";

const CrossPodWrite = () => {
  const { session } = useContext(SessionContext);
  const {
    clearValue: clearDescription,
    _type,
    ...description
  } = useField("textarea");
  const [file, setFile] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleCrossPodUpload = (event) => {
    event.preventDefault();
    // dummy calls for now
    console.log(event.target.crossPodWrite.value);
    console.log(event.target.document.value);
    console.log(event.target.date.value);
    console.log(event.target.description.value);
    console.log(file);
  };

  const formRowStyle = {
    margin: "20px 0",
  };

  return (
    <div hidden={!session.info.isLoggedIn ? "hidden" : ""} className="panel">
      <strong>Cross Pod Upload</strong>
      <form id="crossPodWrite" onSubmit={handleCrossPodUpload}>
        <div style={formRowStyle}>
          <label>Paste other user's pod url to upload to: </label>
          <input size="60" type="text" name="crossPodWrite" />
        </div>
        <div style={formRowStyle}>
          <label>Choose document type to upload: </label>
          <DocumentSelection />
        </div>
        <div style={formRowStyle}>
          <label>Expiration date (if applicable): </label>
          <input name="date" type="date" />
        </div>
        <div style={formRowStyle}>
          <label>Enter description:</label>
          <br />
          <br />
          <textarea name="description" {...description} />
        </div>
        <div style={formRowStyle}>
          <label>File to upload: </label>
          <input
            type="file"
            id="input_file"
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
    </div>
  );
};

export default CrossPodWrite;
