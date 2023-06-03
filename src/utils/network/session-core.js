import {
  createContainerAt,
  getSolidDataset,
  createThing,
  buildThing,
  setThing,
  createSolidDataset,
  saveSolidDatasetInContainer,
  deleteContainer,
  deleteFile,
  overwriteFile,
  getThingAll,
  getDatetime,
  getStringNoLocale
} from '@inrupt/solid-client';
import { RDF_PREDICATES, INTERACTION_TYPES } from '../../constants';
import {
  getContainerUrl,
  placeFileInContainer,
  getContainerUrlAndFiles,
  hasTTLFiles,
  setDocAclForUser,
  createResourceTtlFile,
  updateTTLFile,
  SOLID_IDENTITY_PROVIDER,
  getUserProfileName,
  saveMessageTTLInInbox,
  setDocAclForPublic
} from './session-helper';
import { getUserSigningKey, signDocumentTtlFile } from '../cryptography/credentials-helper';

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
 * @typedef {import("../typedefs").inboxListObject} inboxListObject
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
  const documentUrl = getContainerUrl(session, fileType, INTERACTION_TYPES.SELF);
  const webId = `https://${otherPodUsername}.${
    SOLID_IDENTITY_PROVIDER.split('/')[2]
  }/profile/card#me`;

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
    `${containerUrl}Bank%20Statement/`,
    `${containerUrl}Passport/`,
    `${containerUrl}Drivers%20License/`
  ];

  const webId = `https://${otherPodUsername}.${
    SOLID_IDENTITY_PROVIDER.split('/')[2]
  }/profile/card#me`;

  urlsToSet.forEach(async (url) => {
    await setDocAclForUser(session, url, 'update', webId, permissions);
  });
};

/*
  File Management Section

  Functions here deal primarily with file handling to Solid Pod via PASS (i.e,
  file uploads, file search, file deletion, etc.)
*/

/**
 * Function that uploads file to Pod on Solid
 *
 * @memberof utils
 * @function uploadDocument
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {string} uploadType - A string which indicates what type of upload is
 * being used
 * @param {fileObjectType} fileObject - Object containing information about file
 * from form submission (see {@link fileObjectType})
 * @param {boolean} verifyDocument - True if document submission should include
 * user verification
 * @param {string} [otherPodUsername] - If cross pod interaction, this is the
 * username of the other user, set to an empty string by default
 * @returns {Promise} Promise - File upload is handled via Solid libraries
 */
export const uploadDocument = async (
  session,
  uploadType,
  fileObject,
  verifyDocument,
  otherPodUsername = ''
) => {
  const fileName = fileObject.file.name;

  let containerUrl;
  if (uploadType === INTERACTION_TYPES.SELF) {
    containerUrl = getContainerUrl(session, fileObject.type, INTERACTION_TYPES.SELF);
  } else {
    containerUrl = getContainerUrl(session, 'Documents', INTERACTION_TYPES.CROSS, otherPodUsername);
    containerUrl = `${containerUrl}${fileObject.type.replace("'", '').replace(' ', '%20')}/`;
  }

  await createContainerAt(containerUrl, { fetch: session.fetch });

  const documentUrl = `${containerUrl}${fileName.replace(' ', '%20')}`;
  const datasetFromUrl = await getSolidDataset(containerUrl, { fetch: session.fetch });
  const ttlFileExists = hasTTLFiles(datasetFromUrl);

  // Guard clause will throw function if container already exist with ttl file
  // ttl file indicates update instead of upload document
  if (ttlFileExists) {
    throw new Error('TTL file already exists');
  }

  // Place file into Pod container and generate new ttl file for container
  await placeFileInContainer(session, fileObject, containerUrl);
  const newTtlFile = await createResourceTtlFile(fileObject, documentUrl);
  const signingKey = verifyDocument ? await getUserSigningKey(session) : null;

  let newSolidDataset = createSolidDataset();
  newSolidDataset = setThing(newSolidDataset, newTtlFile);
  const signatureDataset = signingKey
    ? await signDocumentTtlFile(signingKey, newSolidDataset, session, containerUrl)
    : null;

  // Generate document.ttl file for container
  await saveSolidDatasetInContainer(containerUrl, newSolidDataset, {
    slugSuggestion: 'document.ttl',
    contentType: 'text/turtle',
    fetch: session.fetch
  });

  if (signatureDataset) {
    await saveSolidDatasetInContainer(containerUrl, signatureDataset, {
      slugSuggestion: 'signature.ttl',
      contentType: 'text/turtle',
      fetch: session.fetch
    });
  }

  if (uploadType === INTERACTION_TYPES.SELF) {
    // Generate ACL file for new container
    await setDocAclForUser(session, containerUrl, 'create', session.info.webId);
  }
};

/**
 * Function that update file to Pod on Solid
 *
 * @memberof utils
 * @function updateDocument
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {string} uploadType - A string which indicates what type of upload is
 * being used
 * @param {fileObjectType} fileObject - Object containing information about file
 * from form submission (see {@link fileObjectType})
 * @param {string} [otherPodUsername] - If cross pod interaction, this is the URL
 * of the other user, set to an empty string by default
 * @returns {Promise<boolean>} fileExist - A boolean for if file exist on Solid
 * Pod and updates the file if accepted, or if file doesn't exist, uploads a new
 * file to Solid Pod if accepted
 */
export const updateDocument = async (session, uploadType, fileObject, otherPodUsername = '') => {
  let containerUrl;
  const fileName = fileObject.file.name;
  if (uploadType === INTERACTION_TYPES.SELF) {
    containerUrl = getContainerUrl(session, fileObject.type, INTERACTION_TYPES.SELF);
  } else {
    containerUrl = getContainerUrl(session, 'Documents', INTERACTION_TYPES.CROSS, otherPodUsername);
    containerUrl = `${containerUrl}${fileObject.type.replace(' ', '%20')}/`;
  }

  const documentUrl = `${containerUrl}${fileName}`;
  const solidDataset = await getSolidDataset(containerUrl, { fetch: session.fetch });

  // Checks for file in Solid Pod
  const [, files] = getContainerUrlAndFiles(solidDataset);
  const fileExist = files.map((file) => file.url).includes(documentUrl);

  const confirmationMessage = fileExist
    ? `File ${fileName} exist in Pod container, do you wish to update it?`
    : `File ${fileName} does not exist in Pod container, do you wish to upload it?`;

  if (window.confirm(confirmationMessage)) {
    await overwriteFile(documentUrl, fileObject.file, { fetch: session.fetch });
    await updateTTLFile(session, containerUrl, fileObject);
  } else {
    throw new Error(fileExist ? 'File update cancelled.' : 'New file upload cancelled.');
  }

  return fileExist;
};

/**
 * Function that fetch the URL of the container containing a specific file
 * uploaded to a user's Pod on Solid, if exist
 *
 * @memberof utils
 * @function getDocuments
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {string} fileType - Type of document
 * @param {string} fetchType - Type of fetch (to own Pod, or "self" or to
 * other Pods, or "cross")
 * @param {string} [otherPodUsername] - Url to other user's Pod (set to empty string
 * by default)
 * @returns {Promise<URL>} Promise - Either a string containing the url location of
 * the document, if exist, or throws an Error
 */
export const getDocuments = async (session, fileType, fetchType, otherPodUsername = '') => {
  const documentUrl = getContainerUrl(session, fileType, fetchType, otherPodUsername);

  try {
    await getSolidDataset(documentUrl, { fetch: session.fetch });

    return documentUrl;
  } catch (error) {
    throw new Error('No data found');
  }
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
  const documentsContainerUrl = `https://${otherPodUsername}.${
    SOLID_IDENTITY_PROVIDER.split('/')[2]
  }/Documents/`;

  try {
    await getSolidDataset(documentsContainerUrl, { fetch: session.fetch });

    return documentsContainerUrl;
  } catch (error) {
    throw new Error('No data found');
  }
};

/**
 * Function that deletes all files from a Solid container associated to a file
 * type, if exist, and returns the container's URL
 *
 * @memberof utils
 * @function deleteDocuments
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {string} fileType - Type of document
 * @returns {Promise<URL>} container.url - The URL of document container and the
 * response on whether document file is deleted, if exist, then deletes all
 * existing files within it
 */
export const deleteDocumentFile = async (session, fileType) => {
  const documentUrl = getContainerUrl(session, fileType, INTERACTION_TYPES.SELF);

  const fetched = await getSolidDataset(documentUrl, { fetch: session.fetch });

  // Solid requires all files within Pod container must be deleted before
  // the container itself can be deleted from Pod
  const [container, files] = getContainerUrlAndFiles(fetched);
  files.filter(async (file) => {
    if (!file.url.slice(-3).includes('/')) {
      await deleteFile(file.url, { fetch: session.fetch });
    }
  });

  return container.url;
};

/**
 * Function that delete a Solid container from Pod on Solid given the
 * container's URL, if exist
 *
 * @memberof utils
 * @function deleteDocumentContainer
 * @param {Session} session - Solid's Session Object
 * @param {URL} documentUrl - Url link to document container
 * @returns {Promise} Promise - Perform action that deletes container completely
 * from Pod
 */
export const deleteDocumentContainer = async (session, documentUrl) => {
  await deleteContainer(documentUrl, { fetch: session.fetch });
};

/**
 * Function that generates the Documents container for users
 *
 * @memberof utils
 * @param {Session} session - Solid's Session Object
 * @param {URL} podUrl - The user's Pod URL
 * @returns {Promise} Promise - Creates Documents container for storage of
 * documents being uploaded by authorized users
 */

export const createDocumentContainer = async (session, podUrl) => {
  const userContainerUrl = `${podUrl}Documents/`;

  try {
    await getSolidDataset(userContainerUrl, { fetch: session.fetch });
  } catch {
    await createContainerAt(userContainerUrl, { fetch: session.fetch });

    const createContainerList = [
      `${userContainerUrl}Bank%20Statement/`,
      `${userContainerUrl}Passport/`,
      `${userContainerUrl}Drivers%20License/`
    ];

    createContainerList.forEach(async (url) => {
      await createContainerAt(url, { fetch: session.fetch });
    });

    const newTtlFile = buildThing(createThing({ name: 'documentContainer' }))
      .addStringNoLocale(RDF_PREDICATES.name, 'Document Container')
      .addStringNoLocale(RDF_PREDICATES.description, 'A container for documents')
      .addUrl(RDF_PREDICATES.url, `${userContainerUrl}container.ttl`)
      .build();

    let newSolidDataset = createSolidDataset();
    newSolidDataset = setThing(newSolidDataset, newTtlFile);

    // Generate document.ttl file for container
    await saveSolidDatasetInContainer(userContainerUrl, newSolidDataset, {
      slugSuggestion: 'container.ttl',
      contentType: 'text/turtle',
      fetch: session.fetch
    });

    // Generate ACL file for container
    await setDocAclForUser(session, userContainerUrl, 'create', session.info.webId);
    createContainerList.forEach(async (url) => {
      await setDocAclForUser(session, url, 'create', session.info.webId);
    });
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
  const publicContainerUrl = `${podUrl}public/`;

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
  User Inbox Section

  Functions here deal primarily with user inbox/outbox on PASS
*/

/**
 * Function that gets list of inbox TTL file messages and returns the messages as
 * JSON
 *
 * @memberof utils
 * @function getInboxMessageTTL
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {inboxListObject[]} inboxList - List of inbox messages
 * @returns {Promise<inboxListObject[]>} inboxList - An array of inbox messages
 * from the user's inbox on Solid in JSON format
 */
export const getInboxMessageTTL = async (session, inboxList) => {
  const inboxContainerUrl = getContainerUrl(session, 'Inbox', INTERACTION_TYPES.SELF);
  let messageList = [];
  try {
    const solidDataset = await getSolidDataset(inboxContainerUrl, {
      fetch: session.fetch
    });
    const ttlFileThing = getThingAll(solidDataset);
    const allMessageThing = ttlFileThing.filter((thing) => thing.url.slice(-3).includes('ttl'));

    // Early return if length of inbox in both PASS and Solid is the same
    if (allMessageThing.length === inboxList.length) {
      return inboxList;
    }

    try {
      const promises = allMessageThing.map(async (messageTTL) => {
        const messageDataset = await getSolidDataset(messageTTL.url, { fetch: session.fetch });

        const messageTTLThing = getThingAll(messageDataset);

        // Get data related to #message
        const messageThing = messageTTLThing.find((thing) => thing.url.includes('#message'));
        const message = getStringNoLocale(messageThing, RDF_PREDICATES.message);
        const title = getStringNoLocale(messageThing, RDF_PREDICATES.title);
        const uploadDate = getDatetime(messageThing, RDF_PREDICATES.uploadDate);

        // Get data related to #sender
        const senderThing = messageTTLThing.find((thing) => thing.url.includes('#sender'));
        const sender = getStringNoLocale(senderThing, RDF_PREDICATES.sender);

        // Get data related to #recipient
        const recipientThing = messageTTLThing.find((thing) => thing.url.includes('#recipient'));
        const recipient = getStringNoLocale(recipientThing, RDF_PREDICATES.recipient);

        messageList.push({ message, title, uploadDate, sender, recipient });
      });

      await Promise.all(promises);
    } catch (err) {
      messageList = inboxList;
    }
  } catch {
    messageList = inboxList;
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
 * @returns {Promise} Promise - Sends a TTL file to another user's Pod inbox and
 * saves a copy on your inbox
 */
export const sendMessageTTL = async (session, messageObject) => {
  const { title, message, recipientUsername } = messageObject;
  const containerUrl = getContainerUrl(
    session,
    'Inbox',
    INTERACTION_TYPES.CROSS,
    recipientUsername
  );
  const inboxUrl = getContainerUrl(session, 'Inbox', INTERACTION_TYPES.SELF);

  const senderUsername = session.info.webId.split('profile')[0].split('/')[2].split('.')[0];
  const recipientWebId = `https://${recipientUsername}.${
    SOLID_IDENTITY_PROVIDER.split('/')[2]
  }/profile/card#me`;

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

  const newMessageTTL = buildThing(createThing({ name: 'message' }))
    .addDatetime(RDF_PREDICATES.uploadDate, date)
    .addStringNoLocale(RDF_PREDICATES.title, title)
    .addStringNoLocale(RDF_PREDICATES.message, message)
    .build();

  const senderInfo = buildThing(createThing({ name: 'sender' }))
    .addStringNoLocale(RDF_PREDICATES.sender, senderName)
    .addUrl(RDF_PREDICATES.url, session.info.webId)
    .build();

  const recipientInfo = buildThing(createThing({ name: 'recipient' }))
    .addStringNoLocale(RDF_PREDICATES.recipient, recipientName)
    .addUrl(RDF_PREDICATES.url, recipientWebId)
    .build();

  let newSolidDataset = createSolidDataset();
  [newMessageTTL, senderInfo, recipientInfo].forEach((thing) => {
    newSolidDataset = setThing(newSolidDataset, thing);
  });

  const messageSlug = `requestPerms-${senderUsername}-${dateYYYYMMDD}-${dateISOTime}`;

  try {
    await Promise.all([
      await saveMessageTTLInInbox(session, containerUrl, newSolidDataset, messageSlug),
      await saveMessageTTLInInbox(session, inboxUrl, newSolidDataset, messageSlug)
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
 * @param {URL} podUrl - The user's Pod URL
 * @returns {Promise} Promise - Generates an outbox for Pod upon log in if
 * user's Pod does not have the an outbox to begin with
 */
export const createOutbox = async (session, podUrl) => {
  const outboxContainerUrl = `${podUrl}outbox/`;

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
 * @param {URL} podUrl - The user's Pod URL
 * @returns {Promise} Promise - Generates an outbox for Pod upon log in if
 * user's Pod does not have the an outbox to begin with
 */

export const createInbox = async (session, podUrl) => {
  const inboxContainerUrl = `${podUrl}inbox/`;

  try {
    await getSolidDataset(inboxContainerUrl, { fetch: session.fetch });
  } catch {
    await createContainerAt(inboxContainerUrl, { fetch: session.fetch });

    // Generate ACL file for container
    await setDocAclForUser(session, inboxContainerUrl, 'create', session.info.webId);
    await setDocAclForPublic(session, inboxContainerUrl, { append: true });
  }
};
