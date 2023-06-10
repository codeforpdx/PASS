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

export { docTypes, runNotification };

export * from './network/session-core';
