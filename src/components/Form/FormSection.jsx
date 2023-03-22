import React from 'react';
import { StatusNotification } from '../Notification';

/**
 * @typedef {Object} statusNotificationObject
 * @property {String|null} documentUrl - Url link to document container
 * @property {String} message - Status message for file upload, query, or deletion
 * @property {String|null} timeoutID - Timeout ID for status message
 * @property {Object|null} file - Object that includes file in question
 * @property {Boolean} processing - Boolean on whether application is uploading,
 * fetching, querying data from Solid
 */

/**
 * @typedef {Object} formSectionProps
 * @property {String} title - Title of form section
 * @property {statusNotificationObject} state - The state for status notification
 * @property {String} statusType - Type of action for PASS
 * @property {String} defaultMessage - Default notification message when inactive
 * @property {JSX.Element} children - JSX Element of the wrapped form
 */

/**
 * FormSection Component - Component that wraps Form with StatusNotification
 * @memberof Forms
 * @component
 * @name FormSection
 * @param {formSectionProps} formSectionProps - A react prop that consists of that
 * consist of title, state, statusType, defaultMessage, and children
 */

const FormSection = ({ title, state, statusType, defaultMessage, children }) => (
  <section className="panel">
    <strong>{title}</strong>
    {children}
    <StatusNotification
      notification={state.message}
      statusType={statusType}
      defaultMessage={defaultMessage}
      locationUrl={state.documentUrl}
    />
  </section>
);

export default FormSection;
