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
  saveSolidDatasetAt
} from '@inrupt/solid-client';
import sha256 from 'crypto-js/sha256';
import getDriversLicenseData from './barcode-scan';
import formattedDate from './barcode-date-parser';
import { RDF_PREDICATES } from '../constants';

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
 * @typedef {import('../typedefs').fileObjectType} fileObjectType
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
export const SOLID_IDENTITY_PROVIDER = OIDUrl;

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
 * @returns {boolean} Boolean - A boolean on whether a ttl file exist from
 * dataset
 */

export const hasTTLFiles = (solidDataset) => {
  const items = getThingAll(solidDataset);
  if (!items) {
    return false;
  }

  const ttlFiles = items.find((item) => item.url.slice(-3) === 'ttl');
  if (ttlFiles) {
    return true;
  }

  return false;
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

  items.forEach((file) => {
    if (!file.url.slice(-3).includes('/')) {
      files.push(file);
    } else {
      directory = file;
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
  let POD_URL;
  if (fetchType === 'self-fetch') {
    POD_URL = String(session.info.webId.split('profile')[0]);
  } else {
    POD_URL = `https://${otherPodUsername}.${SOLID_IDENTITY_PROVIDER.split('/')[2]}/`;
  }

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
 * @returns {AclDataset} - Solid Session Dataset with updated ACL file (see
 * {@link AclDataset})
 */

export const setupAcl = (resourceWithAcl, webId, accessObject) => {
  // setAgentResourceAccess will set ACL for resource and setAgentDefaultAcess
  // will set ACL for resource container
  let acl = setAgentResourceAccess(resourceWithAcl, webId, accessObject);
  acl = setAgentDefaultAccess(acl, webId, accessObject);

  return acl;
};

/**
 * Function that generates ACL file for container containing a specific document
 * type and turtle file and give the user access and control to the Solid
 * container
 *
 * @memberof utils
 * @function createDocAclForUser
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {URL} documentUrl - Url link to document container
 * @returns {Promise} Promise - Generates ACL file for container and give user
 * access and control to it and its contents
 */

export const createDocAclForUser = async (session, documentUrl) => {
  const podResourceWithoutAcl = await getSolidDataset(documentUrl, { fetch: session.fetch });

  const resourceAcl = createAcl(podResourceWithoutAcl);
  const accessObject = {
    read: true,
    append: true,
    write: true,
    control: true
  };

  const newAcl = setupAcl(resourceAcl, session.info.webId, accessObject);
  await saveAclFor(podResourceWithoutAcl, newAcl, { fetch: session.fetch });
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
 * @returns {Promise} Promise - Generates checksum for uploaded file using the SHA256 algorithm
 */
const createFileChecksum = async (fileObject) => {
  const { file } = fileObject;

  const text = await file.text(); // only hash the first megabyte
  return sha256(text);
};

/**
 * Helper Function that returns Driver's License ttl file based off of image passed
 *
 * @memberof utils
 * @param {fileObjectType} fileObject - Object containing information about file
 * @param {string} documentUrl - url of uploaded document or resource
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
 * @returns {object}
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
    .addStringNoLocale(RDF_PREDICATES.serialNumber, checksum)
    .addStringNoLocale(RDF_PREDICATES.description, fileObject.description)
    .addUrl(RDF_PREDICATES.url, documentUrl)
    .build();
};
