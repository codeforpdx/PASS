/**
 * The utils module to help run functions for PASS forms, notifications, and
 * Solid Session. The file session-core contains functions that is exported to
 * PASS, while session-helper contains functions that is only exported to
 * session-core
 *
 * @module utils
 * @namespace utils
 */

import docTypes from './form-helper';
import { runNotification, clearProcessing } from './notification-helper';
import {
  uploadDocument,
  updateDocument,
  getDocuments,
  deleteDocumentContainer,
  deleteDocumentFile,
  setDocAclPermission,
  generateUsersList,
  addUserToPod,
  getUsersFromPod,
  deleteUserFromPod,
  generateActivityTTL,
  updateUserActivity,
  getUserListActivity,
  createDocumentContainer,
  setDocContainerAclPermission,
  checkContainerPermission,
  sendMessageTTL
} from './session-core';
import { SOLID_IDENTITY_PROVIDER } from './session-helper';
import makeHandleFormSubmission from './FormSubmissionHelper';
import removeKeys from './logout-helper';

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
  generateUsersList,
  addUserToPod,
  getUsersFromPod,
  deleteUserFromPod,
  generateActivityTTL,
  updateUserActivity,
  getUserListActivity,
  createDocumentContainer,
  setDocContainerAclPermission,
  checkContainerPermission,
  sendMessageTTL,
  makeHandleFormSubmission,
  removeKeys
};
