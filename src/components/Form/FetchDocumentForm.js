import { useContext, useReducer } from "react";
import { SessionContext } from "../../App";
import { fetchDocuments, runNotification } from "../../utils";
import DocumentSelection from "./DocumentSelection";
import StatusNotification from "./StatusNotification";

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

  return (
    <div hidden={!session.info.isLoggedIn ? "hidden" : ""} className="panel">
      <div className="row">
        <strong>Search Document</strong>
        <br />
        <br />
        <form onSubmit={handleGetDocumentSubmission}>
          <DocumentSelection /> <button>Get Document</button>
        </form>
      </div>
      <div className="row">
        <StatusNotification
          notification={state.message}
          statusType="Search Status"
          defaultMessage="To be searched..."
          locationUrl={state.documentLocation}
        />
      </div>
    </div>
  );
};

export default FetchDocumentForm;
