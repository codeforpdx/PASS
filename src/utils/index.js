/**
 * The utils module to help run functions for PASS forms, notifications, and
 * Solid Session. The file session-core contains functions that is exported to
 * PASS, while session-helper contains functions that is only exported to
 * session-core
 *
 * @module utils
 * @namespace utils
 */
import runNotification from './frontend/notification-helper';
import getDriversLicenseData from './barcode/barcode-scan';
import formattedDate from './barcode/barcode-date-parser';

export { runNotification, getDriversLicenseData, formattedDate };

export * from './cryptography/credentials-helper';
export * from './network/session-core';
export * from './network/session-helper';
