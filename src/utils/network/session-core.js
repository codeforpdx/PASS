import {
  getSolidDataset,
  getThingAll,
  getFile,
  getThing,
  getBoolean,
  buildThing,
  setThing,
  saveSolidDatasetAt,
  createThing
} from '@inrupt/solid-client';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import {
  setDocAclForUser,
  getUserProfileName,
  saveMessageTTL,
  parseMessageTTL,
  buildMessageTTL
} from './session-helper';
import { RDF_PREDICATES } from '../../constants';

/**
 * @typedef {import('@inrupt/solid-client-authn-browser').Session} Session
 */

/**
 * @typedef {import('@inrupt/solid-client').Access} Access
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
 * @param {string} docType - Type of document
 * @param {Access} permissions - The Access object for setting ACL in Solid
 * @param {URL} podUrl - URL of the user's Pod
 * @param {string} webIdToSetPermsTo - URL of the other user's Pod to give/revoke permissions OR empty string
 * @returns {Promise} Promise - Sets permission for otherPodUsername for given
 * document type, if exists, or null
 */
export const setDocAclPermission = async (
  session,
  docType,
  permissions,
  podUrl,
  webIdToSetPermsTo
) => {
  const containerUrl = `${podUrl}PASS/Documents/`;
  const documentUrl = `${containerUrl}${docType.replace("'", '').replace(' ', '_')}/`;

  await setDocAclForUser(session, documentUrl, 'update', webIdToSetPermsTo, permissions);
};

/**
 * Function that sets permissions for a user's document container's ACL file
 *
 * @memberof utils
 * @function setDocContainerAclPermission
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {Access} permissions - The Access object for setting ACL in Solid
 * @param {URL} podUrl - URL of the user's Pod
 * @param {string} webIdToSetPermsTo - URL of the other user's Pod to give/revoke permissions OR empty string
 * @returns {Promise} Promise - Sets permission for otherPodUsername for the user's
 * Documents container
 */
export const setDocContainerAclPermission = async (
  session,
  permissions,
  podUrl,
  webIdToSetPermsTo
) => {
  const containerUrl = `${podUrl}PASS/Documents/`;

  await setDocAclForUser(session, containerUrl, 'update', webIdToSetPermsTo, permissions);
};

/*
  User Message Section
  
  Functions here deal primarily with user messages on PASS
*/

/**
 * Function that fetches a list of TTL file messages from the Solid Pod and
 * returns the messages as a list of messageListObject
 *
 * @memberof utils
 * @function getMessageTTL
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {string} boxType - The message box being called "Inbox" or "Outbox"
 * @param {messageListObject[]} listMessages - A list of messageListObjects
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

    // early return if there's not message TTL files on Solid
    if (allMessageThing.length === 0) {
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
 * Function that sends a message to another user's Pod inbox as a TTL file and
 * saves a copy in the sender's outbox
 *
 * @memberof utils
 * @function sendMessageTTL
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {object} messageObject - An object containing inputs for the the message
 * @param {URL} podUrl - The Pod URL of the user to send message to
 * @returns {Promise} Promise - Sends a TTL file to another user's Pod inbox and
 * saves a copy on the sender's outbox
 */
export const sendMessageTTL = async (session, messageObject, podUrl) => {
  const { recipientPodUrl } = messageObject;
  const recipientWebId = `${recipientPodUrl}profile/card#me`;
  const recipientInboxUrl = `${recipientPodUrl}PASS/Inbox/`;
  const outboxUrl = `${podUrl}PASS/Outbox/`;

  const senderName = (await getUserProfileName(session.info.webId)) || podUrl;
  const recipientName = (await getUserProfileName(recipientWebId)) || recipientPodUrl;

  const date = dayjs().$d;
  const dateYYYYMMDD = dayjs().format('YYYYMMDD');
  const dateISOTime = dayjs().toISOString().split('T')[1].split('.')[0].replace(/:/g, '');
  const messageSlug = `${encodeURIComponent(
    messageObject.title.replace(':', '-')
  )}-${dateYYYYMMDD}-${dateISOTime}`;

  const messageMetadata = {
    messageId: uuidv4(),
    podUrl,
    senderName,
    recipientName,
    recipientPodUrl,
    recipientWebId,
    messageSlug
  };

  const newSolidDatasets = ['sender', 'recipient'].map((person) =>
    buildMessageTTL(session, date, messageObject, messageMetadata, person)
  );

  try {
    await Promise.all([
      saveMessageTTL(session, outboxUrl, newSolidDatasets[0], messageSlug),
      saveMessageTTL(session, recipientInboxUrl, newSolidDatasets[1], messageSlug)
    ]);
  } catch (error) {
    throw new Error(
      'Message failed to send. Reason: PASS-specific inbox does not exist for sender or recipient'
    );
  }
};

/**
 * Function that updates the read status of the message in the inbox
 *
 * @memberof utils
 * @function updateMessageReadStatus
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {object} messageObject - An object containing inputs for the the message
 * @returns {Promise} Promise - Perform action that updates read status of message
 * on messageObject
 */
export const updateMessageReadStatus = async (session, messageObject) => {
  let messageDataset = await getSolidDataset(messageObject.messageUrl, {
    fetch: session.fetch
  });
  let messageStatusThing = getThing(messageDataset, `${messageObject.messageUrl}#messagestatus`);

  if (messageStatusThing) {
    const readStatus = getBoolean(messageStatusThing, RDF_PREDICATES.value);

    if (!readStatus) {
      messageStatusThing = buildThing(messageStatusThing)
        .setBoolean(RDF_PREDICATES.value, true)
        .build();
    }
  } else {
    messageStatusThing = buildThing(createThing({ name: 'messagestatus' }))
      .addStringNoLocale(RDF_PREDICATES.propertyValue, 'Read Status')
      .addBoolean(RDF_PREDICATES.value, true)
      .build();
  }

  messageDataset = setThing(messageDataset, messageStatusThing);

  try {
    await saveSolidDatasetAt(messageObject.messageUrl, messageDataset, { fetch: session.fetch });
  } catch (error) {
    throw new Error('Failed to update ttl file.');
  }
};

/**
 * A function that returns a file URL that could be used in local iframe
 *
 * @function getBlobFromSolid
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {URL} fileUrl - URL of file you wish to view
 * @returns {Promise<URL>} URL - URL of file blob which can be used locally for
 * iframes
 */

export const getBlobFromSolid = async (session, fileUrl) => {
  const fileBlob = await getFile(fileUrl, { fetch: session.fetch });
  return URL.createObjectURL(fileBlob);
};
