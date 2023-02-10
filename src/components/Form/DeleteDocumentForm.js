import { useContext, useState } from "react";
import { SessionContext } from "../../App";
import StatusNotification from "../StatusNotification";
import { deleteDocuments } from "../../utils/session-helper";
import { runNotification } from "../../utils/notification-helper";

const DeleteDocumentForm = () => {
  const { session } = useContext(SessionContext);

  // initialize states for potential document location on pod
  const [deleteSubmitted, setDeleteSubmitted] = useState({
    state: false,
    message: "",
  });
  const [timeoutID, setTimeoutID] = useState(null);

  const docTypes = ["Bank Statement", "Passport", "Drivers License"];

  // Event handler for deleting document
  const handleDeleteDocument = (event) => {
    event.preventDefault();
    deleteDocuments(session, event.target.documentDelete.value)
      .then((_response) =>
        runNotification(
          "File deleted from Pod",
          7,
          timeoutID,
          setDeleteSubmitted,
          setTimeoutID
        )
      )
      .catch((_error) => {
        runNotification(
          "Deletion failed. Reason: Data not found",
          7,
          timeoutID,
          setDeleteSubmitted,
          setTimeoutID
        );
      });
  };

  return (
    <div hidden={!session.info.isLoggedIn ? "hidden" : ""} className="panel">
      <div className="row">
        <strong>Delete Document</strong>
        <br />
        <br />
        <form onSubmit={handleDeleteDocument}>
          <select name="documentDelete" id="documentDelete">
            {docTypes.map((doc, index) => {
              return <option key={index}>{doc}</option>;
            })}
          </select>{" "}
          <button>Delete Document</button>
        </form>
      </div>
      <div className="row">
        <StatusNotification
          notification={deleteSubmitted}
          statusType="Deletion Status"
          defaultMessage="To be searched..."
        />
      </div>
    </div>
  );
};

export default DeleteDocumentForm;
