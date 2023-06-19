import { createContainerAt, getSolidDataset, getThingAll } from '@inrupt/solid-client';
import { INTERACTION_TYPES } from '../../constants';
import {
  getContainerUrl,
  setDocAclForUser,
  getUserProfileName,
  saveMessageTTL,
  parseMessageTTL,
  buildMessageTTL,
  setDocAclForPublic,
  getPodUrl
} from './session-helper';

/**
 * @typedef {import('@inrupt/solid-ui-react').SessionContext} Session
 */

/**
 * @typedef {import('@inrupt/solid-client').Access} Access
 */

/**
 * @typedef {import('../../typedefs').fileObjectType} fileObjectType
 */

/**
 * @typedef {import("../../typedefs").userListObject} userListObject
 */

/**
 * @typedef {import("../../typedefs").messageListObject} messageListObject
 */

/*
  File Permissions Section

  Functions here deals primarily setting ACL permissions to other users
*/

/**
 * Function that sets permissions for a user's document container's ACL file
 *
 * @memberof utils
 * @function setDocAclPermission
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {string} fileType - Type of document
 * @param {Access} permissions - The Access object for setting ACL in Solid
 * @param {string} otherPodUsername - Username to other user's Pod or empty string
 * @returns {Promise} Promise - Sets permission for otherPodUsername for given
 * document type, if exists, or null
 */
export const setDocAclPermission = async (session, fileType, permissions, otherPodUsername) => {
  const containerUrl = getContainerUrl(session, 'Documents', INTERACTION_TYPES.SELF);
  const documentUrl = `${containerUrl}${fileType.replace("'", '').replace(' ', '_')}/`;
  const otherPodUrl = getPodUrl(otherPodUsername);
  const webId = `${otherPodUrl}profile/card#me`;

  await setDocAclForUser(session, documentUrl, 'update', webId, permissions);
};

/**
 * Function that sets permissions for a user's document container's ACL file
 *
 * @memberof utils
 * @function setDocContainerAclPermission
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {Access} permissions - The Access object for setting ACL in Solid
 * @param {string} otherPodUsername - Username to other user's Pod or empty string
 * @returns {Promise} Promise - Sets permission for otherPodUsername for the user's
 * Documents container
 */
export const setDocContainerAclPermission = async (session, permissions, otherPodUsername) => {
  const containerUrl = getContainerUrl(session, 'Documents', INTERACTION_TYPES.SELF);
  const urlsToSet = [
    containerUrl,
    `${containerUrl}Bank_Statement/`,
    `${containerUrl}Passport/`,
    `${containerUrl}Drivers_License/`
  ];

  const otherPodUrl = getPodUrl(otherPodUsername);
  const webId = `${otherPodUrl}profile/card#me`;

  urlsToSet.forEach(async (url) => {
    await setDocAclForUser(session, url, 'update', webId, permissions);
  });
};

/**
 * Function that checks the user's permission of another user's Documents container
 *
 * @memberof utils
 * @function checkContainerPermission
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {string} otherPodUsername - Username to other user's Pod
 * @returns {Promise<URL>} Promise - Either a string containing the url location
 * of the container, if permitted, or throws an Error
 */
export const checkContainerPermission = async (session, otherPodUsername) => {
  const otherPodUrl = getPodUrl(otherPodUsername);
  const documentsContainerUrl = `${otherPodUrl}PASS/Documents/`;

  try {
    await getSolidDataset(documentsContainerUrl, { fetch: session.fetch });

    return documentsContainerUrl;
  } catch (error) {
    throw new Error('No data found');
  }
};

/**
 * Function that creates a public container in the user's Pod when logging in for
 * the first time
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

/*
  User Message Section
  
  Functions here deal primarily with user messages on PASS
*/

/**
 * Function that gets list of inbox TTL file messages and returns the messages as
 * lists of objects
 *
 * @memberof utils
 * @function getMessageTTL
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {string} boxType - The message box being called "Inbox" or "Outbox"
 * @param {messageListObject[]} listMessages - List of messages
 * @param {URL} podUrl - The pod URL of user
 * @returns {Promise<messageListObject[]>} inboxList - An array of inbox messages
 * from the user's inbox on Solid in JSON format
 */

export const getMessageTTL = async (session, boxType, listMessages, podUrl) => {
  const messageBoxContainerUrl = `${podUrl}PASS/${boxType}/`;
  let messageList = [];
  try {
    const solidDataset = await getSolidDataset(messageBoxContainerUrl, {
      fetch: session.fetch
    });
    const ttlFileThing = getThingAll(solidDataset);
    const allMessageThing = ttlFileThing.filter((thing) => thing.url.endsWith('ttl'));

    // Early return if length of inbox in both PASS and Solid is the same
    if (allMessageThing.length === listMessages.length) {
      return listMessages;
    }

    try {
      const promises = allMessageThing.map(async (messageTTL) => {
        const messageDataset = await getSolidDataset(messageTTL.url, { fetch: session.fetch });

        const messageTTLThing = getThingAll(messageDataset);
        const parsedMessageObject = parseMessageTTL(messageTTLThing);

        messageList.push(parsedMessageObject);
      });

      await Promise.all(promises);
    } catch (err) {
      messageList = listMessages;
    }
  } catch {
    messageList = listMessages;
  }

  return messageList;
};

/**
 * Function that sends a message to another user's Pod inbox and saves a copy in
 * user's own inbox
 *
 * @memberof utils
 * @function sendMessageTTL
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {object} messageObject - An object containing inputs for the the message
 * @param {URL} podUrl - The user's Pod URL
 * @returns {Promise} Promise - Sends a TTL file to another user's Pod inbox and
 * saves a copy on your inbox
 */
export const sendMessageTTL = async (session, messageObject, podUrl) => {
  const { recipientUsername } = messageObject;
  const containerUrl = getContainerUrl(
    session,
    'Inbox',
    INTERACTION_TYPES.CROSS,
    recipientUsername
  );
  const outboxUrl = `${podUrl}PASS/Outbox/`;

  const senderUsername = podUrl.split('/')[2].split('.')[0];
  const otherPodUrl = getPodUrl(recipientUsername);
  const recipientWebId = `${otherPodUrl}profile/card#me`;

  const senderName = await getUserProfileName(session, session.info.webId);
  let recipientName;

  try {
    recipientName = await getUserProfileName(session, recipientWebId);
  } catch (error) {
    throw new Error('Message failed to send. Reason: Recipient username not found');
  }

  const date = new Date();
  const dateYYYYMMDD = date.toISOString().split('T')[0].replace(/-/g, '');
  const dateISOTime = date.toISOString().split('T')[1].split('.')[0].replace(/:/g, '');

  const newSolidDataset = buildMessageTTL(
    session,
    date,
    messageObject,
    senderName,
    recipientName,
    recipientWebId
  );

  const messageSlug = `requestPerms-${senderUsername}-${dateYYYYMMDD}-${dateISOTime}`;

  try {
    await Promise.all([
      saveMessageTTL(session, containerUrl, newSolidDataset, messageSlug),
      saveMessageTTL(session, outboxUrl, newSolidDataset, messageSlug)
    ]);
  } catch (error) {
    throw new Error('Message failed to send. Reason: Inbox does not exist for sender or recipient');
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
 * @returns {Promise} Promise - Generates an outbox for Pod upon log in if
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
