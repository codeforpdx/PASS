import { useContext } from "react";
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

  const handleFileChange = () => {};

  return (
    <div hidden={!session.info.isLoggedIn ? "hidden" : ""} className="panel">
      <div class="row">
        <strong>Cross Pod Upload</strong>
        <br />
        <br />
        <form id="crossPodWrite">
          <label id="writelabel" htmlFor="input_file">
            Paste other user's pod url to upload to:{" "}
          </label>
          <input size="60" type="text" name="crossPodWrite" />
          <br />
          <br />
          <label>Choose document type to upload: </label>
          <DocumentSelection />
          <br />
          <p>Expiration date (if applicable):</p>
          <input name="date" id="date" type="date" />
          <br />
          <p>Enter description:</p>
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
          <button type="submit">Upload to Pod</button>
        </form>
      </div>
      <StatusNotification
        notification=""
        statusType="Writing status"
        defaultMessage="To be uploaded..."
      />
    </div>
  );
};

export default CrossPodWrite;
