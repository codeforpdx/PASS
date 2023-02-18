import { useReducer } from "react";
import { useSession } from "@inrupt/solid-ui-react";
import {
  deleteDocumentFile,
  deleteDocumentContainer,
  runNotification,
} from "../../utils/";
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
    case "SET_DOCUMENT_LOCATION":
      return { ...state, documentLocation: action.payload };
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "SET_TIMEOUTID":
      return { ...state, timeoutID: action.payload };
    default:
      throw new Error("No action");
  }
};

const DeleteDocumentForm = () => {
  const { session } = useSession();
  // Combined state for file upload with useReducer
  const [state, dispatch] = useReducer(deleteReducer, {
    message: "",
    timeoutID: null,
  });

  // Event handler for deleting document
  const handleDeleteDocument = async (event) => {
    event.preventDefault();
    try {
      const documentUrl = await deleteDocumentFile(
        session,
        event.target.document.value
      );
      runNotification(
        "File being deleted from Pod...",
        2,
        state.timeoutID,
        dispatch
      );
      // Solid requires all files to be removed from container before it can be removed
      // setTimeout lets deleteDocumentFile finish removing the files
      setTimeout(() => {
        deleteDocumentContainer(session, documentUrl);
        runNotification(
          "Removing file container from Pod...",
          7,
          state.timeoutID,
          dispatch
        );
      }, 2000);
    } catch (_error) {
      runNotification(
        "Deletion failed. Reason: Data not found",
        7,
        state.timeoutID,
        dispatch
      );
    }
  };

  const formRowStyle = {
    margin: "20px 0",
  };

  return (
    <div hidden={!session.info.isLoggedIn ? "hidden" : ""} className="panel">
      <strong>Delete Document</strong>
      <form onSubmit={handleDeleteDocument}>
        <div style={formRowStyle}>
          <label>Select document type to delete: </label>
          <DocumentSelection /> <button>Delete Document</button>
        </div>
      </form>
      <StatusNotification
        notification={state.message}
        statusType="Deletion status"
        defaultMessage="To be searched..."
      />
    </div>
  );
};

export default DeleteDocumentForm;
