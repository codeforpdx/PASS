import {
  saveFileInContainer,
  getSolidDataset,
  getThingAll,
  createAcl,
  setAgentResourceAccess,
  saveAclFor,
  setAgentDefaultAccess,
  createThing,
  buildThing,
  setThing,
  saveSolidDatasetAt,
  getProfileAll,
  getThing,
  getStringNoLocale,
  saveSolidDatasetInContainer,
  getResourceAcl,
  getSolidDatasetWithAcl,
  setPublicResourceAccess,
  getDatetime
} from '@inrupt/solid-client';
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
 * @typedef {import('@inrupt/solid-ui-react').SessionContext} Session
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
 * The URL to a specific Solid Provider
 *
 * @name SOLID_IDENTITY_PROVIDER
 * @type {URL}
 * @memberof utils
 */

// Vite exposes static env variables in the `import.meta.env` object
// https://vitejs.dev/guide/env-and-mode.html
const OIDUrl =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_SOLID_IDENTITY_PROVIDER_DEV
    : import.meta.env.VITE_SOLID_IDENTITY_PROVIDER_PRODUCTION;
export const SOLID_IDENTITY_PROVIDER = OIDUrl.replace(/\r/g, '');

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
 * Function that checks if container URL contains TTL files
 *
 * @memberof utils
 * @function hasTTLFiles
 * @param {SolidDataset} solidDataset - Solid's dataset object on Pod
 * @returns {boolean} Boolean - A boolean on whether a ttl file exist from dataset
 */

export const hasTTLFiles = (solidDataset) => {
  const items = getThingAll(solidDataset);
  if (!items) {
    return false;
  }

  return items.some((item) => item.url.endsWith('ttl'));
};

/**
 * Function checks if Solid dataset on Pod contains any files
 *
 * @memberof utils
 * @function getContainerUrlAndFiles
 * @param {SolidDataset} solidDataset - Solid's dataset object on Pod (see
 * {@link SolidDataset})
 * @returns {Array|null} [directory, files] or null - An Array of Objects
 * consisting of the directory container URL and the rest of the files or null
 */

export const getContainerUrlAndFiles = (solidDataset) => {
  const items = getThingAll(solidDataset);
  if (!items) {
    return null;
  }

  let directory = '';
  const files = [];

  items.forEach((item) => {
    if (!item.url.endsWith('/')) {
      files.push(item);
    } else {
      directory = item;
    }
  });

  return [directory, files];
};

/**
 * Function that returns the location of the Solid container containing a
 * specific file type, if exist on user's Pod
 *
 * @memberof utils
 * @function getContainerUrl
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {string} fileType - Type of document
 * @param {string} fetchType - Type of fetch (to own Pod, or "self-fetch" or to
 * other Pods, or "cross-fetch")
 * @param {URL} otherPodUsername - Username to other user's Pod or empty string
 * @returns {URL|null} url or null - A url of where the container that stores
 * the file is located in or null, if container doesn't exist
 */

export const getContainerUrl = (session, fileType, fetchType, otherPodUsername) => {
  const POD_URL =
    fetchType === 'self-fetch'
      ? String(session.info.webId.split('profile')[0])
      : `https://${otherPodUsername}.${SOLID_IDENTITY_PROVIDER.split('/')[2]}/`;

  switch (fileType) {
    case 'Bank Statement':
      return `${POD_URL}Bank%20Statement/`;
    case 'Passport':
      return `${POD_URL}Passport/`;
    case "Driver's License":
      return `${POD_URL}Drivers%20License/`;
    case 'Users':
      return `${POD_URL}Users/`;
    case 'Documents':
      return `${POD_URL}Documents/`;
    case 'Inbox':
      return `${POD_URL}inbox/`;
    case 'Outbox':
      return `${POD_URL}outbox/`;
    default:
      return null;
  }
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
  let ttlFile = getThingAll(solidDataset)[0];

  ttlFile = buildThing(ttlFile)
    .setStringNoLocale(RDF_PREDICATES.endDate, fileObject.date)
    .setStringNoLocale(RDF_PREDICATES.description, fileObject.description)
    .setDatetime(RDF_PREDICATES.dateModified, new Date())
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
    .addDatetime(RDF_PREDICATES.uploadDate, new Date())
    .addStringNoLocale(RDF_PREDICATES.additionalType, dlData.DCA)
    .addStringNoLocale(RDF_PREDICATES.conditionsOfAccess, dlData.DCB)
    .addDate(RDF_PREDICATES.expires, new Date(`${formattedDate(dlData.DBA)}`))
    .addStringNoLocale(RDF_PREDICATES.givenName, dlData.DCS)
    .addStringNoLocale(RDF_PREDICATES.alternateName, dlData.DAC)
    .addStringNoLocale(RDF_PREDICATES.familyName, dlData.DAD)
    .addDate(RDF_PREDICATES.dateIssued, new Date(`${formattedDate(dlData.DBD)}`))
    .addDate(RDF_PREDICATES.dateOfBirth, new Date(`${formattedDate(dlData.DBB)}`))
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
    .addDatetime(RDF_PREDICATES.uploadDate, new Date())
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

export const getUserProfileName = async (session, webId) => {
  const profile = await getProfileAll(webId, { fetch: session.fetch });
  const profileDataThing = getThing(profile.webIdProfile, webId);
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

  // Get data related to #sender
  const senderThing = messageTTLThing.find((thing) => thing.url.includes('#sender'));
  const sender = getStringNoLocale(senderThing, RDF_PREDICATES.sender);

  // Get data related to #recipient
  const recipientThing = messageTTLThing.find((thing) => thing.url.includes('#recipient'));
  const recipient = getStringNoLocale(recipientThing, RDF_PREDICATES.recipient);

  return { message, title, uploadDate, sender, recipient };
};
