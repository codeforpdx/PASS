/**
 * StatusNotification Component
 * @memberof Forms
 * @component
 * @name StatusNotification
 * @param {object}
 * @property {string} notification - File status message
 * @property {string} statusType - Type of file status (i.e. file upload, file fetch, file delete)
 * @property {string} defaultMessage - Default message when status is not triggered
 * @property {string} [locationUrl] - URL location of file, if exist
 * @returns {void}
 */

const StatusNotification = ({
  notification,
  statusType,
  defaultMessage,
  locationUrl = "",
}) => {
  return (
    <dl className="display">
      <dt>
        <label>{statusType}:</label>
      </dt>
      {notification ? (
        locationUrl ? (
          <dd className="labelStatus" role="alert">
            {notification}{" "}
            <a href={locationUrl} target="_blank">
              {locationUrl}
            </a>
          </dd>
        ) : (
          <dd className="labelStatus" role="alert">
            {notification}
          </dd>
        )
      ) : (
        <dd>{defaultMessage}</dd>
      )}
    </dl>
  );
};

export default StatusNotification;
