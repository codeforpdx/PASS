import { useContext, useState } from "react";
import { SessionContext } from "../../App";
import StatusNotification from "../StatusNotification";
import { deleteDocuments } from "../../utils/session-helper";

const DeleteDocumentForm = () => {
  const { session } = useContext(SessionContext);

  // initialize states for potential document location on pod
  const [deleteSubmitted, setDeleteSubmitted] = useState({
    state: false,
    message: "",
  });
  const [timeoutID, setTimeoutID] = useState(null);

  // Setting up a more robust notification system
  // but this needs refactoring in future
  const handleDeleteMessage = (message, time) => {
    if (timeoutID) {
      clearTimeout(timeoutID);
      setDeleteSubmitted({ state: true, message });
    }

    const timeout = setTimeout(() => {
      setDeleteSubmitted({
        state: false,
        message: "",
      });
    }, time * 1000);
    setTimeoutID(timeout);
    setDeleteSubmitted({ state: true, message });
  };

  const formRowStyle = {
    margin: "20px 0",
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
