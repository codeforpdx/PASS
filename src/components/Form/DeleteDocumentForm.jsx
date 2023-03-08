import { useSession } from "@inrupt/solid-ui-react";
import { useStatusNotification } from "../../hooks";
import {
  deleteDocumentFile,
  deleteDocumentContainer,
  runNotification,
} from "../../utils";
import DocumentSelection from "./DocumentSelection";
import StatusNotification from "./StatusNotification";

const DeleteDocumentForm = () => {
  const { session } = useSession();
  // Combined state for file upload with useReducer
  const { state, dispatch } = useStatusNotification();

  // Event handler for deleting document
  const handleDeleteDocument = async (event) => {
    event.preventDefault();
    try {
      const documentUrl = await deleteDocumentFile(
        session,
        event.target.document.value
      );
      runNotification("File being deleted from Pod...", 2, state, dispatch);
      // Solid requires all files to be removed from container before it can be removed
      // setTimeout lets deleteDocumentFile finish removing the files
      setTimeout(() => {
        deleteDocumentContainer(session, documentUrl);
        runNotification(
          "Removing file container from Pod...",
          7,
          state,
          dispatch
        );
      }, 2000);
    } catch (_error) {
      runNotification(
        "Deletion failed. Reason: Data not found",
        7,
        state,
        dispatch
      );
      console.log("Deletion failed. Reason: Data not found");
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
      <div className="col s12 m7 container">
        <div className="card horizontal">
          <div className="card-stacked">
            <div className="card-content">
              <div className="section no-pad-bot row center">
                <strong>Delete Document</strong>
                <form onSubmit={handleDeleteDocument}>
                  <div style={formRowStyle}>
                    <label htmlFor="delete-doctype">
                      Select document type to delete:{" "}
                    </label>
                    <DocumentSelection htmlId="delete-doctype" />{" "}
                    <button
                      type="submit"
                      className="btn-small waves-effect waves-light teal"
                    >
                      Delete Document
                    </button>
                  </div>
                </form>
                <StatusNotification
                  notification={state.message}
                  statusType="Deletion status"
                  defaultMessage="To be searched..."
                />{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeleteDocumentForm;
