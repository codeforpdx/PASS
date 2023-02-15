import { useContext, useReducer } from "react";
import { SessionContext } from "../../App";
import { deleteDocuments, runNotification } from "../../utils/";
import DocumentSelection from "./DocumentSelection";
import StatusNotification from "./StatusNotification";

/**
 * @typedef deleteReducerObject
 * @property {string} message - File status message
 * @property {string|null} timeoutID - timeoutID for status message
 */

/**
 * @memberof Forms
 * @function deleteReducer
 * @param {deleteReducerObject} state - State for file deletion and status message
 * @param {Object} action - useReducer Object for useReducer hook containing action.payload
 * @return {deleteReducerObject} An updated state based on useReducer action
 */

const deleteReducer = (state, action) => {
  switch (action.type) {
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "SET_TIMEOUTID":
      return { ...state, timeoutID: action.payload };
    default:
      throw new Error("No action");
  }
};

const DeleteDocumentForm = () => {
  const { session } = useContext(SessionContext);
  // Combined state for file upload with useReducer
  const [state, dispatch] = useReducer(deleteReducer, {
    message: "",
    timeoutID: null,
  });

  // Event handler for deleting document
  const handleDeleteDocument = (event) => {
    event.preventDefault();
    deleteDocuments(session, event.target.document.value)
      .then((_response) =>
        runNotification("File deleted from Pod", 7, state.timeoutID, dispatch)
      )
      .catch((_error) => {
        runNotification(
          "Deletion failed. Reason: Data not found",
          7,
          state.timeoutID,
          dispatch
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
          <DocumentSelection /> <button>Delete Document</button>
        </form>
      </div>
      <div className="row">
        <StatusNotification
          notification={state.message}
          statusType="Deletion Status"
          defaultMessage="To be searched..."
        />
      </div>
    </div>
  );
};

export default DeleteDocumentForm;
