import { useContext, useState } from "react";
import { SessionContext } from "../../App";
import StatusNotification from "../StatusNotification";
import { deleteDocuments } from "../../utils/session-helper";

const DeleteDocumentForm = () => {
  const { session } = useContext(SessionContext);

  // initialize states for potential document location on pod
  const [documentLocation, setDocumentLocation] = useState("");
  const [deleteSubmitted, setDeleteSubmitted] = useState({
    state: false,
    message: "",
  });

  const handleDeleteMessage = (message) => {
    setTimeout(() => {
      setDeleteSubmitted({
        state: false,
        message: "",
      });
    }, 7000);
    setDeleteSubmitted({
      state: true,
      message,
    });
  };

  const docTypes = ["Bank Statement", "Passport", "Drivers License"];

  const handleGetDocumentSubmission = (event) => {
    event.preventDefault();
    deleteDocuments(session, event.target.documentGet.value)
      .then((_response) => handleDeleteMessage("File deleted from Pod"))
      .catch((_error) => {
        handleDeleteMessage("Deletion failed. Reason: Data not found");
      });
  };

  return (
    <div hidden={!session.info.isLoggedIn ? "hidden" : ""} className="panel">
      <div className="row">
        <strong>Delete Document</strong>
        <br />
        <br />
        <form onSubmit={handleGetDocumentSubmission}>
          <select name="documentGet" id="documentGet">
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
          locationUrl={documentLocation}
        />
      </div>
    </div>
  );
};

export default DeleteDocumentForm;
