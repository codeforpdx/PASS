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
import runNotification from './notification-helper';
import {
  uploadDocument,
  updateDocument,
  fetchDocuments,
  deleteDocumentContainer,
  deleteDocumentFile,
  setDocAclPermission,
  addUserToPod,
  getUsersFromPod,
  deleteUserFromPod
} from './session-core';
import { SOLID_IDENTITY_PROVIDER } from './session-helper';

export {
  docTypes,
  runNotification,
  SOLID_IDENTITY_PROVIDER,
  uploadDocument,
  updateDocument,
  fetchDocuments,
  deleteDocumentContainer,
  deleteDocumentFile,
  setDocAclPermission,
  addUserToPod,
  getUsersFromPod,
  deleteUserFromPod
};
