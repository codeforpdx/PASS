import React from 'react';
import { StatusNotification } from '../Notification';

/**
 * @typedef {import('../../hooks').statusNotificationObject} statusNotificationObject
 */

/**
 * @typedef {Object} formSectionProps
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
 * consist of state, statusType, defaultMessage, and children
 */

const FormSection = ({ state, statusType, defaultMessage, children }) => (
  <section className="panel">
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
