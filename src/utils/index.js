/**
 * The utils module to help run functions for PASS forms, notifications, and
 * Solid Session. The file session-core contains functions that is exported to
 * PASS, while session-helper contains functions that is only exported to
 * session-core
 *
 * @module utils
 * @namespace utils
 */

import docTypes from './frontend/form-helper';
import runNotification from './frontend/notification-helper';
import {
  uploadDocument,
  updateDocument,
  getDocuments,
  deleteDocumentFile,
  setDocAclPermission,
  createDocumentContainer,
  setDocContainerAclPermission,
  checkContainerPermission,
  sendMessageTTL,
  createOutbox,
  getMessageTTL,
  createPublicContainer,
  createInbox,
  showDocuments,
  showDocumentLocal
} from './network/session-core';
import { getPodUrl } from './network/session-helper';
import makeHandleFormSubmission from './frontend/FormSubmissionHelper';

export {
  docTypes,
  runNotification,
  uploadDocument,
  updateDocument,
  getDocuments,
  deleteDocumentFile,
  setDocAclPermission,
  createDocumentContainer,
  setDocContainerAclPermission,
  checkContainerPermission,
  sendMessageTTL,
  makeHandleFormSubmission,
  createOutbox,
  getMessageTTL,
  createPublicContainer,
  createInbox,
  getPodUrl,
  showDocuments,
  showDocumentLocal
};
