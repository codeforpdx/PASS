import { useContext, useReducer } from "react";
import { SessionContext } from "../../App";
import { fetchDocuments, runNotification } from "../../utils";
import DocumentSelection from "./DocumentSelection";
import StatusNotification from "./StatusNotification";

/**
 * @typedef fetchReducerObject
 * @property {string} documentLocation - A string containing the URL of the file location, if exist
 * @property {string} message - File status message
 * @property {string|null} timeoutID - timeoutID for status message
 */

/**
 * @memberof Forms
 * @function fetchReducer
 * @param {fetchReducerObject} state - State for fetch file and status message
 * @param {Object} action - useReducer Object for useReducer hook containing action.payload
 * @return {fetchReducerObject} An updated state based on useReducer action
 */

const fetchReducer = (state, action) => {
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

const FetchDocumentForm = () => {
  const { session } = useContext(SessionContext);
  // Combined state for file upload with useReducer
  const [state, dispatch] = useReducer(fetchReducer, {
    documentLocation: "",
    message: "",
    timeoutID: null,
  });

  // Event handler for fetching document
  const handleGetDocumentSubmission = (event) => {
    event.preventDefault();
    fetchDocuments(session, event.target.document.value)
      .then((documentUrl) => {
        dispatch({ type: "SET_DOCUMENT_LOCATION", payload: documentUrl });
        runNotification(
          `Document found! Document located at: `,
          7,
          state.timeoutID,
          dispatch
        );
      })
      .catch((_error) => {
        dispatch({ type: "SET_DOCUMENT_LOCATION", payload: "" });
        runNotification(
          `Search failed. Reason: Document not found`,
          7,
          state.timeoutID,
          dispatch
        );
      });
  };

  const formRowStyle = {
    margin: "20px 0",
  };

  return (
    <div hidden={!session.info.isLoggedIn ? "hidden" : ""} className="panel">
      <strong>Search Document</strong>
      <form onSubmit={handleGetDocumentSubmission}>
        <div style={formRowStyle}>
          <label>Select document type to search: </label>
          <DocumentSelection /> <button>Get Document</button>
        </div>
      </form>
      <StatusNotification
        notification={state.message}
        statusType="Search status"
        defaultMessage="To be searched..."
        locationUrl={state.documentLocation}
      />
    </div>
  );
};

export default FetchDocumentForm;
