import { useContext } from "react";
import { SessionContext } from "../../App";
import StatusNotification from "./StatusNotification";
import DocumentSelection from "./DocumentSelection";

const CrossPodQuery = () => {
  const { session } = useContext(SessionContext);

  return (
    <div hidden={!session.info.isLoggedIn ? "hidden" : ""} className="panel">
      <div class="row">
        <strong>Cross Pod Search</strong>
        <br />
        <br />
        <form id="crossPodQueryDocument">
          <label>Paste other user's pod url to search from: </label>
          <input size="60" type="text" name="crossPodQuery" />
          <br />
          <br />
          <DocumentSelection /> <button type="submit">Search Pod</button>
        </form>
      </div>
      <StatusNotification
        notification=""
        statusType="Writing status"
        defaultMessage="To be searched..."
      />
    </div>
  );
};

export default CrossPodQuery;
