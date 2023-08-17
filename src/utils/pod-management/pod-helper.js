import {
  createContainerAt,
  getSolidDataset,
  getSolidDatasetWithAcl,
  hasResourceAcl
} from '@inrupt/solid-client';
import { setDocAclForPublic, setDocAclForUser } from '../network/session-helper';

/**
 * @typedef {import('@inrupt/solid-client-authn-browser').Session} Session
 */

/**
 * Function that creates a public container in the user's Pod when logging in for
 * the first time or if Public is missing and initialize it with an ACL with
 * access to the user
 *
 * @memberof utils
 * @function createPublicContainer
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {URL} podUrl - The user's Pod URL
 * @returns {Promise} Promise - Generates a public container for Pod upon log in
 * if user's Pod does not have the an outbox to begin with
 */
export const createPublicContainer = async (session, podUrl) => {
  const publicContainerUrl = `${podUrl}PASS/Public/`;

  try {
    await getSolidDataset(publicContainerUrl, { fetch: session.fetch });
  } catch {
    await createContainerAt(publicContainerUrl, { fetch: session.fetch });

    // Generate ACL file for container
    await setDocAclForUser(session, publicContainerUrl, 'create', session.info.webId);
    await setDocAclForPublic(session, publicContainerUrl, { read: true });
  }
};

/**
 * Function that creates a Documents container in the user's Pod when logging in
 * for the first time or if Documents is missing and initialize it with an ACL with
 * access to the user
 *
 * @memberof utils
 * @function createDocumentsContainer
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {URL} podUrl - The user's Pod URL
 * @returns {Promise} Promise - Generates a Documents container for Pod upon log
 * in if user's Pod does not have the an outbox to begin with
 */
export const createDocumentsContainer = async (session, podUrl) => {
  const documentsContainerUrl = `${podUrl}PASS/Documents/`;

  try {
    const solidDataset = await getSolidDatasetWithAcl(documentsContainerUrl, {
      fetch: session.fetch
    });

    const resourceAclExists = hasResourceAcl(solidDataset);

    if (!resourceAclExists) {
      await setDocAclForUser(session, documentsContainerUrl, 'create', session.info.webId);
    }
  } catch {
    await createContainerAt(documentsContainerUrl, { fetch: session.fetch });

    // Generate ACL file for container
    await setDocAclForUser(session, documentsContainerUrl, 'create', session.info.webId);
  }
};

/**
 * Function that creates an outbox container in the user's Pod when logging in for
 * the first time
 *
 * @memberof utils
 * @function createOutbox
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {URL} podUrl - The pod URL of user
 * @returns {Promise} Promise - Generates an outbox for Pod upon log in if
 * user's Pod does not have the an outbox to begin with
 */
export const createOutbox = async (session, podUrl) => {
  const outboxContainerUrl = `${podUrl}PASS/Outbox/`;

  try {
    await getSolidDataset(outboxContainerUrl, { fetch: session.fetch });
  } catch {
    await createContainerAt(outboxContainerUrl, { fetch: session.fetch });

    // Generate ACL file for container
    await setDocAclForUser(session, outboxContainerUrl, 'create', session.info.webId);
  }
};

/**
 * Function that creates an inbox container in the user's Pod when logging in for
 * the first time
 *
 * @memberof utils
 * @function createInbox
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {URL} podUrl - The pod URL of user
 * @returns {Promise} Promise - Generates an inbox for Pod upon log in if
 * user's Pod does not have the an outbox to begin with
 */
export const createInbox = async (session, podUrl) => {
  const inboxContainerUrl = `${podUrl}PASS/Inbox/`;

  try {
    await getSolidDataset(inboxContainerUrl, { fetch: session.fetch });
  } catch {
    await createContainerAt(inboxContainerUrl, { fetch: session.fetch });

    // Generate ACL file for container
    await setDocAclForUser(session, inboxContainerUrl, 'create', session.info.webId);
    await setDocAclForPublic(session, inboxContainerUrl, { append: true });
  }
};

/**
 * Function that creates a Profile container in the user's Pod when logging in
 * for the first time within the PASS container separate from the public profile
 *
 * @memberof utils
 * @function createPrivateProfile
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {URL} podUrl - The pod URL of user
 * @returns {Promise} Promise - Generates a Profile container for Pod upon log
 * in if user's Pod does not have the Profile container to begin with PASS
 */
export const createPrivateProfile = async (session, podUrl) => {
  const privateProfileContainerUrl = `${podUrl}PASS/Profile/`;

  try {
    await getSolidDataset(privateProfileContainerUrl, { fetch: session.fetch });
  } catch {
    await createContainerAt(privateProfileContainerUrl, { fetch: session.fetch });

    // Generate ACL file for container
    await setDocAclForUser(session, privateProfileContainerUrl, 'create', session.info.webId);
  }
};
