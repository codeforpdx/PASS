import { useContext } from "react";
import { SessionContext } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { runNotification } from "../../reducers/notificationReducer";
import { fetchDocuments } from "../../utils/session-helper";
import DocumentSelection from "./DocumentSelection";
import StatusNotification from "./StatusNotification";

const FetchDocumentForm = () => {
  const { session } = useContext(SessionContext);
  const dispatch = useDispatch();
  // Get state from redux store
  const fetchNotification = useSelector((state) => state.fetchNotification);

  // Event handler for fetching document
  const handleGetDocumentSubmission = (event) => {
    event.preventDefault();
    fetchDocuments(session, event.target.document.value)
      .then((documentUrl) => {
        dispatch(
          runNotification({
            message: "Document found! Document located at: ",
            statusType: "fetch",
            documentUrl,
            time: 7,
          })
        );
      })
      .catch((_error) => {
        dispatch(
          runNotification({
            message: "Search failed. Reason: Document not found",
            statusType: "fetch",
            time: 7,
          })
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
          notification={fetchNotification.message}
          statusType="Search Status"
          defaultMessage="To be searched..."
          locationUrl={fetchNotification.documentUrl}
        />
      </div>
    </div>
  );
};

export default FetchDocumentForm;
