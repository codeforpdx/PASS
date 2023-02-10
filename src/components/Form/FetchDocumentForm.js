import { useContext, useState } from "react";
import { SessionContext } from "../../App";
import { fetchDocuments } from "../../utils/session-helper";
import { runNotification } from "../../utils/notification-helper";
import DocumentSelection from "./DocumentSelection";
import StatusNotification from "./StatusNotification";

const FetchDocumentForm = () => {
  const { session } = useContext(SessionContext);

  // initialize states for potential document location on pod
  const [documentLocation, setDocumentLocation] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState({
    state: false,
    message: "",
  });
  const [timeoutID, setTimeoutID] = useState(null);

  // Event handler for fetching document
  const handleGetDocumentSubmission = (event) => {
    event.preventDefault();
    fetchDocuments(session, event.target.document.value)
      .then((documentUrl) => {
        setDocumentLocation(documentUrl);
        runNotification(
          `Document found! Document located at: `,
          7,
          timeoutID,
          setSearchSubmitted,
          setTimeoutID
        );
      })
      .catch((_error) => {
        setDocumentLocation("");
        runNotification(
          `Search failed. Reason: Document not found`,
          7,
          timeoutID,
          setSearchSubmitted,
          setTimeoutID
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
          notification={searchSubmitted}
          statusType="Search Status"
          defaultMessage="To be searched..."
          locationUrl={documentLocation}
        />
      </div>
    </div>
  );
};

export default FetchDocumentForm;
