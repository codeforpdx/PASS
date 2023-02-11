import { useContext } from "react";
import { SessionContext } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { runNotification } from "../../reducers/notificationReducer";
import { deleteDocuments } from "../../utils/session-helper";
import DocumentSelection from "./DocumentSelection";
import StatusNotification from "./StatusNotification";

const DeleteDocumentForm = () => {
  const { session } = useContext(SessionContext);
  const dispatch = useDispatch();
  // Get state from redux store
  const deleteNotification = useSelector((state) => state.deleteNotification);

  // Event handler for deleting document
  const handleDeleteDocument = (event) => {
    event.preventDefault();
    deleteDocuments(session, event.target.document.value)
      .then((_response) =>
        dispatch(
          runNotification({
            message: "File deleted from Pod",
            statusType: "delete",
            time: 7,
          })
        )
      )
      .catch((_error) => {
        dispatch(
          runNotification({
            message: "Deletion failed. Reason: Data not found",
            statusType: "delete",
            time: 7,
          })
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
          notification={deleteNotification.message}
          statusType="Deletion Status"
          defaultMessage="To be searched..."
        />
      </div>
    </div>
  );
};

export default DeleteDocumentForm;
