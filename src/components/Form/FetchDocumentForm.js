import { useContext, useState } from "react";
import { SessionContext } from "../../App";
import StatusNotification from "../StatusNotification";
import { fetchDocuments } from "../../utils/session-helper";

const FetchDocumentForm = () => {
  const { session } = useContext(SessionContext);

  // initialize states for potential document location on pod
  const [documentLocation, setDocumentLocation] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState({
    state: false,
    message: "",
  });
  const [timeoutID, setTimeoutID] = useState(null);

  // Setting up a more robust notification system
  // but this needs refactoring in future
  const handleSearchMessage = (message, time) => {
    if (timeoutID) {
      clearTimeout(timeoutID);
      setSearchSubmitted({ state: true, message });
    }

    const timeout = setTimeout(() => {
      setSearchSubmitted({
        state: false,
        message: "",
      });
    }, time * 1000);
    setTimeoutID(timeout);
    setSearchSubmitted({ state: true, message });
  };

  const docTypes = ["Bank Statement", "Passport", "Drivers License"];

  // Event handler for fetching document
  const handleGetDocumentSubmission = (event) => {
    event.preventDefault();
    fetchDocuments(session, event.target.documentGet.value)
      .then((documentUrl) => {
        setDocumentLocation(documentUrl);
        handleSearchMessage(`Document found! Document located at: `, 7);
      })
      .catch((_error) => {
        setDocumentLocation("");
        handleSearchMessage(`Search failed. Reason: Document not found`, 7);
      });
  };

  return (
    <div hidden={!session.info.isLoggedIn ? "hidden" : ""} className="panel">
      <div className="row">
        <strong>Search Document</strong>
        <br />
        <br />
        <form onSubmit={handleGetDocumentSubmission}>
          <select name="documentGet" id="documentGet">
            {docTypes.map((doc, index) => {
              return <option key={index}>{doc}</option>;
            })}
          </select>{" "}
          <button>Get Document</button>
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
