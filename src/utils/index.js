/**
 * utils module to help run functions for PASS forms, notifications, and Solid Session
 * @module utils
 * @namespace utils
 */
import docTypes from './form-helper';
import runNotification from './notification-helper';
import {
  SOLID_IDENTITY_PROVIDER,
  uploadDocument,
  fetchDocuments,
  deleteDocumentContainer,
  deleteDocumentFile,
  setDocAclPermission
} from './session-helper';

export {
  docTypes,
  runNotification,
  SOLID_IDENTITY_PROVIDER,
  uploadDocument,
  fetchDocuments,
  deleteDocumentContainer,
  deleteDocumentFile,
  setDocAclPermission
};
