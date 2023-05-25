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
import { runNotification, clearProcessing } from './frontend/notification-helper';
import {
  uploadDocument,
  updateDocument,
  getDocuments,
  deleteDocumentContainer,
  deleteDocumentFile,
  setDocAclPermission,
  fetchUserActivity,
  updateUserActivity,
  createDocumentContainer,
  setDocContainerAclPermission,
  checkContainerPermission,
  sendMessageTTL,
  createOutbox,
  getInboxMessageTTL,
  getUserListActivity
} from './network/session-core';
import { SOLID_IDENTITY_PROVIDER } from './network/session-helper';
import makeHandleFormSubmission from './frontend/FormSubmissionHelper';
import {
  fetchUsersList,
  getUsersFromPod,
  deleteUserFromPod,
  addUserToPod
} from './user-list-helpers';

export {
  docTypes,
  runNotification,
  clearProcessing,
  SOLID_IDENTITY_PROVIDER,
  uploadDocument,
  updateDocument,
  getDocuments,
  deleteDocumentContainer,
  deleteDocumentFile,
  setDocAclPermission,
  getUserListActivity,
  fetchUserActivity,
  updateUserActivity,
  createDocumentContainer,
  setDocContainerAclPermission,
  checkContainerPermission,
  sendMessageTTL,
  makeHandleFormSubmission,
  createOutbox,
  getInboxMessageTTL,
  fetchUsersList,
  getUsersFromPod,
  deleteUserFromPod,
  addUserToPod
};
