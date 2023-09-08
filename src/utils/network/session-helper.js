import {
  saveFileInContainer,
  getSolidDataset,
  createAcl,
  setAgentResourceAccess,
  saveAclFor,
  setAgentDefaultAccess,
  createThing,
  buildThing,
  setThing,
  saveSolidDatasetAt,
  getThing,
  getStringNoLocale,
  saveSolidDatasetInContainer,
  getResourceAcl,
  getSolidDatasetWithAcl,
  setPublicResourceAccess,
  setPublicDefaultAccess,
  getDatetime,
  createSolidDataset,
  getUrl,
  getWebIdDataset,
  getBoolean
} from '@inrupt/solid-client';
import dayjs from 'dayjs';
import sha256 from 'crypto-js/sha256';
import getDriversLicenseData from '../barcode/barcode-scan';
import formattedDate from '../barcode/barcode-date-parser';
import { RDF_PREDICATES } from '../../constants';

/**
 * @typedef {import('@inrupt/solid-client').Access} Access
 */

/**
 * @typedef {import('@inrupt/solid-client').AclDataset} AclDataset
 */

/**
 * @typedef {import('@inrupt/solid-client-authn-browser').Session} Session
 */

/**
 * @typedef {import('@inrupt/solid-client').SolidDataset} SolidDataset
 */

/**
 * @typedef {import('@inrupt/solid-client').Thing} Thing
 */

/**
 * @typedef {import('../../typedefs').fileObjectType} fileObjectType
 */

/**
 * @typedef {import('@inrupt/solid-client').ThingLocal} ThingLocal
 */

/**
 * @typedef {import('crypto-js').CryptoJS.lib.WordArray} WordArray
 */

/**
 * Function that helps place uploaded file from user into the user's Pod via a
 * Solid container
 *
 * @memberof utils
 * @function placeFileInContainer
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {fileObjectType} fileObject - Object of file being uploaded to Solid
 * (see {@link fileObjectType})
 * @param {URL} containerUrl - URL location of Pod container
 * @returns {Promise} Promise - Places and saves uploaded file onto Solid Pod
 * via a container
 */

export const placeFileInContainer = async (session, fileObject, containerUrl) => {
  await saveFileInContainer(containerUrl, fileObject.file, {
    slug: fileObject.file.name,
    fetch: session.fetch
  });
};

/**
 *
 *
 * @memberof utils
 * @function getPodUrl
 * @param {string} username - String of user's Pod username
 * @returns {URL} podUrl - Returns the full pod url from the username based on
 * the existing oidcIssuer the user logged in from
 */

export const getPodUrl = (username) => {
  const podOidcIssuer = localStorage.getItem('oidcIssuer');
  return `${podOidcIssuer.split('/')[0]}//${username}.${podOidcIssuer.split('/')[2]}/`;
};

/**
 * Function that returns the location of the Solid container containing a
 * specific file type, if exist on user's Pod
 *
 * @memberof utils
 * @function getContainerUrl
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {string} containerType - Type of document
 * @param {string} fetchType - Type of fetch (to own Pod, or "self" or to
 * other Pods, or "cross")
 * @param {URL} otherPodUsername - Username to other user's Pod or empty string
 * @returns {URL|null} url or null - A url of where the container that stores
 * the file is located in or null, if container doesn't exist
 */

export const getContainerUrl = (session, containerType, fetchType, otherPodUsername) => {
  const POD_URL =
    fetchType === 'self'
      ? String(session.info.webId.split('profile')[0])
      : getPodUrl(otherPodUsername);

  if (containerType.split(' ').length > 1) {
    return `${POD_URL}PASS/${containerType.replace("'", '').replace(' ', '_')}/`;
  }

  return `${POD_URL}PASS/${containerType}/`;
};

/**
 * Function that setups ACL permissions for a Solid dataset or resource with an
 * ACL file
 *
 * @memberof utils
 * @function setupAcl
 * @param {AclDataset} resourceWithAcl - A Solid Session Dataset with ACL file
 * (see {@link AclDataset})
 * @param {string} webId - Solid webId
 * @param {Access} accessObject - Solid Access Object which sets ACL permission
 * for read, append, write, and control (see {@link Access})
 * @param {Access} [publicAccessObject] - Access Object to set public permissions
 * @returns {AclDataset} - Solid Session Dataset with updated ACL file (see
 * {@link AclDataset})
 */
export const setupAcl = (resourceWithAcl, webId, accessObject, publicAccessObject = null) => {
  // setAgentResourceAccess will set ACL for resource and setAgentDefaultAcess
  // will set ACL for resource container
  let acl = setAgentResourceAccess(resourceWithAcl, webId, accessObject);
  acl = setAgentDefaultAccess(acl, webId, accessObject);
  acl = publicAccessObject ? setPublicResourceAccess(acl, publicAccessObject) : acl;
  return acl;
};

/**
 * Function that generates ACL file for container containing a specific document
 * type and turtle file and give the user access and control to the Solid
 * container
 *
 * @memberof utils
 * @function setDocAclForUser
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {URL} documentUrl - Url link to document container
 * @param {string} generateType - A string for "create" or "update"
 * @param {URL} webId - The webId of the user permissions are set to
 * @param {Access} [accessObject] - Access Object to set user permissions
 * @param {Access} [publicAccessObject] - Access Object to set public permissions
 * @returns {Promise} Promise - Generates ACL file for container and give user
 * access and control to it and its contents
 */
export const setDocAclForUser = async (
  session,
  documentUrl,
  generateType,
  webId,
  accessObject = {
    read: true,
    append: true,
    write: true,
    control: true
  },
  publicAccessObject = null
) => {
  const podResource =
    generateType === 'create'
      ? await getSolidDataset(documentUrl, { fetch: session.fetch })
      : await getSolidDatasetWithAcl(documentUrl, { fetch: session.fetch });
  const resourceAcl =
    generateType === 'create' ? createAcl(podResource) : getResourceAcl(podResource);
  const newAcl = setupAcl(resourceAcl, webId, accessObject, publicAccessObject);
  await saveAclFor(podResource, newAcl, { fetch: session.fetch });
};

/**
 * Function that sets up ACL file for container to public
 *
 * @memberof utils
 * @function setDocAclForPublic
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {URL} documentUrl - Url link to document container
 * @param {Access} accessObject - Access Object to use when creating the file
 * @returns {Promise} Promise - Generates ACL file for container and give user
 * access and control to it and its contents
 */

export const setDocAclForPublic = async (session, documentUrl, accessObject) => {
  const podResource = await getSolidDatasetWithAcl(documentUrl, { fetch: session.fetch });
  const resourceAcl = getResourceAcl(podResource);
  let acl = setPublicResourceAccess(resourceAcl, accessObject);
  acl = setPublicDefaultAccess(acl, accessObject);
  await saveAclFor(podResource, acl, { fetch: session.fetch });
};

/**
 * Function that updates ttl file in Solid container for endDate (expiration
 * date) and description while also including datetime of all instances when
 * document was modified
 *
 * @memberof utils
 * @function updateTTLFile
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {URL} containerUrl - Url link to document container
 * @param {fileObjectType} fileObject - Object containing information about file
 * from form submission (see {@link fileObjectType})
 * @returns {Promise} Promise - Perform an update to an existing document.ttl by
 * setting a new expiration date, description, and date modified
 */

export const updateTTLFile = async (session, containerUrl, fileObject) => {
  let solidDataset = await getSolidDataset(`${containerUrl}document.ttl`, { fetch: session.fetch });
  let ttlFile = getThing(solidDataset, `${containerUrl}document.ttl#document`);

  ttlFile = buildThing(ttlFile)
    .setStringNoLocale(RDF_PREDICATES.endDate, fileObject.date)
    .setStringNoLocale(RDF_PREDICATES.description, fileObject.description)
    .setDatetime(RDF_PREDICATES.dateModified, dayjs().$d)
    .build();
  solidDataset = setThing(solidDataset, ttlFile);

  try {
    await saveSolidDatasetAt(`${containerUrl}document.ttl`, solidDataset, { fetch: session.fetch });
  } catch (error) {
    throw new Error('Failed to update ttl file.');
  }
};

/**
 * Function that generates checksum for uploaded file
 *
 * @memberof utils
 * @function createFileChecksum
 * @param {fileObjectType} fileObject - Object containing information about file
 * from form submission (see {@link fileObjectType})
 * @returns {Promise<WordArray>} Promise - Generates checksum for uploaded file
 * using the SHA256 algorithm
 */
const createFileChecksum = async (fileObject) => {
  const { file } = fileObject;

  const text = await file.text(); // only hash the first megabyte
  return sha256(text);
};

/**
 * Helper Function that returns Driver's License ttl file based off of image passed
 *
 * @function createDriversLicenseTtlFile
 * @memberof utils
 * @function createDriversLicenseTtlFile
 * @param {fileObjectType} fileObject - Object containing information about file
 * @param {URL} documentUrl - url of uploaded document or resource
 * @param {WordArray} checksum - SHA256 checksum for verified uploads\
 * @returns {Promise<ThingLocal>} TTL file Thing - Processes a barcode using zxing
 * and returns a new TTL file Thing
 */

const createDriversLicenseTtlFile = async (fileObject, documentUrl, checksum) => {
  const dlData = await getDriversLicenseData(fileObject.file);
  return buildThing(createThing({ name: 'document' }))
    .addDatetime(RDF_PREDICATES.uploadDate, dayjs().$d)
    .addStringNoLocale(RDF_PREDICATES.additionalType, dlData.DCA)
    .addStringNoLocale(RDF_PREDICATES.conditionsOfAccess, dlData.DCB)
    .addDate(RDF_PREDICATES.expires, dayjs(`${formattedDate(dlData.DBA)}`).$d)
    .addStringNoLocale(RDF_PREDICATES.givenName, dlData.DCS)
    .addStringNoLocale(RDF_PREDICATES.alternateName, dlData.DAC)
    .addStringNoLocale(RDF_PREDICATES.familyName, dlData.DAD)
    .addDate(RDF_PREDICATES.dateIssued, dayjs(`${formattedDate(dlData.DBD)}`).$d)
    .addDate(RDF_PREDICATES.dateOfBirth, dayjs(`${formattedDate(dlData.DBB)}`).$d)
    .addStringNoLocale(RDF_PREDICATES.gender, dlData.DBC)
    .addStringNoLocale(RDF_PREDICATES.Eye, dlData.DAY)
    .addInteger(RDF_PREDICATES.height, Number(dlData.DAU))
    .addStringNoLocale(RDF_PREDICATES.streetAddress, dlData.DAG)
    .addStringNoLocale(RDF_PREDICATES.City, dlData.DAI)
    .addStringNoLocale(RDF_PREDICATES.State, dlData.DAJ)
    .addStringNoLocale(RDF_PREDICATES.postalCode, dlData.DAK)
    .addStringNoLocale(RDF_PREDICATES.identifier, dlData.DAQ)
    .addStringNoLocale(RDF_PREDICATES.identifier, dlData.DCF)
    .addStringNoLocale(RDF_PREDICATES.Country, dlData.DCG)
    .addStringNoLocale(RDF_PREDICATES.additionalName, dlData.DDE)
    .addStringNoLocale(RDF_PREDICATES.additionalName, dlData.DDF)
    .addStringNoLocale(RDF_PREDICATES.additionalName, dlData.DDG)

    .addStringNoLocale(RDF_PREDICATES.name, fileObject.file.name)
    .addStringNoLocale(RDF_PREDICATES.endDate, fileObject.date)
    .addStringNoLocale(RDF_PREDICATES.serialNumber, checksum)
    .addStringNoLocale(RDF_PREDICATES.description, fileObject.description)
    .addUrl(RDF_PREDICATES.url, documentUrl)
    .build();
};

/**
 * Creates a TTL file corresponding to an uploaded document or resource
 *
 * @memberof utils
 * @function createResourceTtlFile
 * @param {fileObjectType} fileObject - Object containing information about file
 * from form submission (see {@link fileObjectType})
 * @param {string} documentUrl - url of uploaded document or resource
 * @returns {Promise<ThingLocal>} Promise - Perform action to generate a newly generated
 * Thing from buildThing
 */

export const createResourceTtlFile = async (fileObject, documentUrl) => {
  const checksum = await createFileChecksum(fileObject);

  if (fileObject.type === "Driver's License") {
    return createDriversLicenseTtlFile(fileObject, documentUrl, checksum);
  }

  return buildThing(createThing({ name: 'document' }))
    .addDatetime(RDF_PREDICATES.uploadDate, dayjs().$d)
    .addStringNoLocale(RDF_PREDICATES.name, fileObject.file.name)
    .addStringNoLocale(RDF_PREDICATES.identifier, fileObject.type)
    .addStringNoLocale(RDF_PREDICATES.endDate, fileObject.date)
    .addStringNoLocale(RDF_PREDICATES.sha256, checksum)
    .addStringNoLocale(RDF_PREDICATES.description, fileObject.description)
    .addUrl(RDF_PREDICATES.url, documentUrl)
    .build();
};

/**
 * Gets user's name from profile using their webId
 *
 * @memberof utils
 * @function getUserProfileName
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {URL} webId - A user's Solid webId attached to Solid Pod
 * @returns {Promise} Promise - Fetch user's name from their Solid Pod profile
 */

export const getUserProfileName = async (webId) => {
  const profile = await getWebIdDataset(webId);
  const profileDataThing = getThing(profile, webId);
  return getStringNoLocale(profileDataThing, RDF_PREDICATES.profileName);
};

/**
 * A function that saves a message TTL file inside containerUrl and name it
 * based on its slug suggestion
 *
 * @memberof utils
 * @function saveMessageTTL
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {URL} containerUrl - URL location of Pod container
 * @param {SolidDataset} solidDataset - Solid's dataset object on Pod
 * @param {string} slug - The slug suggestion for the message file
 * @returns {Promise} Promise - Saves message TTL file inside containerUrl and
 * name the TTL file based on its slug suggestion
 */

export const saveMessageTTL = async (session, containerUrl, solidDatset, slug) => {
  await saveSolidDatasetInContainer(containerUrl, solidDatset, {
    slugSuggestion: `${slug}.ttl`,
    contentType: 'text/turtle',
    fetch: session.fetch
  });
};

/**
 * A function that parses a message TTL file from inbox or outbox and returns a
 * messageObject
 *
 * @memberof utils
 * @function parseMessageTTL
 * @param {Thing[]} messageTTLThing - List of message Things from message boxes
 * @returns {object} messageObject - An object containinng the message content,
 * title, uploadDate, sender, and recipient
 */

export const parseMessageTTL = (messageTTLThing) => {
  // Get data related to #message
  const messageThing = messageTTLThing.find((thing) => thing.url.includes('#message'));
  const message = getStringNoLocale(messageThing, RDF_PREDICATES.message);
  const title = getStringNoLocale(messageThing, RDF_PREDICATES.title);
  const uploadDate = getDatetime(messageThing, RDF_PREDICATES.uploadDate);

  // Get data related to message status
  const messageStatusThing = messageTTLThing.find((thing) => thing.url.includes('#messagestatus'));
  let readStatus;
  if (!messageStatusThing) {
    readStatus = false;
  } else {
    readStatus = getBoolean(messageStatusThing, RDF_PREDICATES.value);
  }

  // Get data related to messageid
  const messageIdThing = messageTTLThing.find((thing) => thing.url.includes('#messageid'));
  const messageId = getStringNoLocale(messageIdThing, RDF_PREDICATES.identifier);
  const messageUrl = getUrl(messageIdThing, RDF_PREDICATES.url);

  // Get data related to #sender
  const senderThing = messageTTLThing.find((thing) => thing.url.includes('#sender'));
  const sender = getStringNoLocale(senderThing, RDF_PREDICATES.sender);
  const senderWebId = getUrl(senderThing, RDF_PREDICATES.url);

  // Get data related to #recipient
  const recipientThing = messageTTLThing.find((thing) => thing.url.includes('#recipient'));
  const recipient = getStringNoLocale(recipientThing, RDF_PREDICATES.recipient);

  return {
    message,
    messageId,
    messageUrl,
    title,
    uploadDate,
    readStatus,
    sender,
    senderWebId,
    recipient
  };
};

/**
 * A function that builds a new message TTL file to be sent
 *
 * @memberof utils
 * @function buildMessageTTL
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {Date} date - JavaScript Date object
 * @param {object} messageObject - Object containing information for the message
 * content
 * @param {object} messageMetadata - Object containing information about the message
 * @param {string} buildFor - String for "Sender" or "Recipient"
 * @returns {object} messageObject - An object containinng the message content,
 * title, uploadDate, sender, and recipient
 */
export const buildMessageTTL = (session, date, messageObject, messageMetadata, buildFor) => {
  const newMessageTTL = buildThing(createThing({ name: 'message' }))
    .addDatetime(RDF_PREDICATES.uploadDate, date)
    .addStringNoLocale(RDF_PREDICATES.title, messageObject.title)
    .addStringNoLocale(RDF_PREDICATES.message, messageObject.message)
    .build();

  const newMessageStatus = buildThing(createThing({ name: 'messagestatus' }))
    .addStringNoLocale(RDF_PREDICATES.propertyValue, 'Read Status')
    .addBoolean(RDF_PREDICATES.value, false)
    .build();

  const newMessageID = buildThing(createThing({ name: 'messageid' }))
    .addStringNoLocale(RDF_PREDICATES.identifier, messageMetadata.messageId)
    .addUrl(
      RDF_PREDICATES.url,
      buildFor === 'sender'
        ? `${messageMetadata.podUrl}PASS/Outbox/${messageMetadata.messageSlug}.ttl`
        : `${messageMetadata.recipientPodUrl}PASS/Inbox/${messageMetadata.messageSlug}.ttl`
    )
    .build();

  const senderInfo = buildThing(createThing({ name: 'sender' }))
    .addStringNoLocale(RDF_PREDICATES.sender, messageMetadata.senderName)
    .addUrl(RDF_PREDICATES.url, session.info.webId)
    .build();

  const recipientInfo = buildThing(createThing({ name: 'recipient' }))
    .addStringNoLocale(RDF_PREDICATES.recipient, messageMetadata.recipientName)
    .addUrl(RDF_PREDICATES.url, messageMetadata.recipientWebId)
    .build();

  let newSolidDataset = createSolidDataset();
  [newMessageTTL, newMessageStatus, newMessageID, senderInfo, recipientInfo].forEach((thing) => {
    newSolidDataset = setThing(newSolidDataset, thing);
  });

  let replyTo;

  if (messageObject.inReplyTo) {
    replyTo = buildThing(createThing({ name: 'replyTo' }))
      .addStringNoLocale(RDF_PREDICATES.identifier, messageObject.inReplyTo)
      .addUrl(
        RDF_PREDICATES.url,
        buildFor === 'sender'
          ? messageObject.messageUrl
          : `${`${messageMetadata.recipientPodUrl}PASS/Outbox/`}${
              messageObject.messageUrl.split(`${messageMetadata.podUrl}PASS/Inbox/`)[1]
            }`
      )
      .build();

    newSolidDataset = setThing(newSolidDataset, replyTo);
  }

  return newSolidDataset;
};

/**
 * Function take saves the source URL to the associated Thing
 *
 * @param {ThingLocal} thing - Associated Thing with source URL
 * @param {URL} sourceUrl - The source URL to the related Thing
 * @param {string} urlPredicate - The string related to which predicate to use
 * @returns {ThingLocal} thing - The updated Thing with the sourceURL now attached
 * to the RDF
 */
export const saveSourceUrlToThing = (thing, sourceUrl, urlPredicate) =>
  buildThing(thing).addUrl(RDF_PREDICATES[urlPredicate], sourceUrl).build();
