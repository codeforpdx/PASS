/**
 * utils module to help run functions for form, notification, and Solid session
 * @module utils
 * @namespace utils
 */
import { docTypes } from "./form-helper";
import { runNotification } from "./notification-helper";
import {
  SOLID_IDENTITY_PROVIDER,
  handleFiles,
  fetchDocuments,
  deleteDocuments,
} from "./session-helper";

export {
  docTypes,
  runNotification,
  SOLID_IDENTITY_PROVIDER,
  handleFiles,
  fetchDocuments,
  deleteDocuments,
};
