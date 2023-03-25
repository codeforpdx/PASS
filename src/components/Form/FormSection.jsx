import React from 'react';
import { StatusNotification } from '../Notification';

/**
 * @typedef {import('../../typedefs').formSectionProps} formSectionProps
 */

/**
 * FormSection Component - Component that wraps Form with StatusNotification
 *
 * @memberof Forms
 * @name FormSection
 * @param {formSectionProps} formSectionProps - A react prop that consists of that
 * consist of title, state, statusType, defaultMessage, and children (see
 * {@link formSectionProps})
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
