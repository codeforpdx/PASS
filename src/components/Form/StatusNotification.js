const StatusNotification = ({
  notification,
  statusType,
  defaultMessage,
  locationUrl = "",
}) => {
  return (
    <dl className="display">
      <dt>{statusType}:</dt>
      {notification ? (
        locationUrl ? (
          <dd id="labelWriteStatus" className="labelStatus" role="alert">
            {notification}{" "}
            <a href={locationUrl} target="_blank">
              {locationUrl}
            </a>
          </dd>
        ) : (
          <dd id="labelWriteStatus" className="labelStatus" role="alert">
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
