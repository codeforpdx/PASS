import { useSession } from "@inrupt/solid-ui-react";
import StatusNotification from "./StatusNotification";
import DocumentSelection from "./DocumentSelection";

const CrossPodQuery = () => {
  const { session } = useSession();

  const handleCrossPodQuery = (event) => {
    event.preventDefault();
    // dummy calls for now
    console.log(event.target.crossPodQuery.value);
    console.log(event.target.document.value);
  };

  const formRowStyle = {
    margin: "20px 0",
  };

  return (
    <div hidden={!session.info.isLoggedIn ? "hidden" : ""} className="panel">
      <strong>Cross Pod Search</strong>
      <form id="crossPodQueryDocument" onSubmit={handleCrossPodQuery}>
        <div style={formRowStyle}>
          <label>Paste other user's pod url to search from: </label>
          <input size="60" type="text" name="crossPodQuery" />
        </div>
        <div style={formRowStyle}>
          <label>Select document type to search: </label>
          <DocumentSelection /> <button type="submit">Search Pod</button>
        </div>
      </form>
      <StatusNotification
        notification=""
        statusType="Writing status"
        defaultMessage="To be searched..."
      />
    </div>
  );
};

export default CrossPodQuery;
