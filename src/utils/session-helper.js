import {
  saveFileInContainer,
  getSolidDataset,
  getThingAll,
  createAcl,
  setAgentResourceAccess,
  saveAclFor,
  setAgentDefaultAccess
} from '@inrupt/solid-client';

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
 * The URL to a specific Solid Provider
 *
 * @name SOLID_IDENTITY_PROVIDER
 * @type {string}
 * @memberof utils
 */

export const SOLID_IDENTITY_PROVIDER = 'https://opencommons.net';

/**
 * Function that helps place uploaded file from user into the user's Pod via a Solid container
 *
 * @memberof utils
 * @function placeFileInContainer
 * @param {Session} session - Solid's Session Object
 * @param {object} fileObject - Object of file being uploaded to Solid
 * @param {string} containerUrl - URL location of Pod container
 * @returns {Promise} Promise - Places and saves uploaded file onto Solid Pod via a container
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
 * @returns {object|null} ttlFiles or null - An object of the first ttl file in location or null,
 * if the ttl file does not exist
 */

export const hasTTLFiles = (solidDataset) => {
  const items = getThingAll(solidDataset);
  if (!items) {
    return null;
  }

  const ttlFiles = items.find((item) => item.url.slice(-3) === 'ttl');
  if (ttlFiles) {
    return ttlFiles;
  }

  return null;
};

/**
 * Function checks if Solid dataset on Pod contains any files
 *
 * @memberof utils
 * @function hasFiles
 * @param {SolidDataset} solidDataset - Solid's dataset object on Pod
 * @returns {Array|null} [directory, files] or null - an Array of Objects consisting of the
 * directory container and the rest of the files or null
 */

export const hasFiles = (solidDataset) => {
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
 * Function that returns the location of the Solid container containing a specific file type,
 * if exist on user's Pod
 *
 * @memberof utils
 * @function fetchUrl
 * @param {Session} session - Solid's Session Object
 * @param {string} fileType - Type of document
 * @param {string} fetchType - Type of fetch (to own Pod, or "self-fetch" or to other Pods,
 * or "cross-fetch")
 * @param {string} otherPodUrl - Url to other user's Pod or empty string
 * @returns {string|null} url or null - A url of where the container that stores the file
 * is located in or null, if container doesn't exist
 */

export const fetchUrl = (session, fileType, fetchType, otherPodUrl) => {
  let POD_URL;
  if (fetchType === 'self-fetch') {
    POD_URL = String(session.info.webId.split('profile')[0]);
  } else {
    POD_URL = `https://${otherPodUrl}/`;
  }

  switch (fileType) {
    case 'Bank Statement':
      return `${POD_URL}Bank%20Statement/`;
    case 'Passport':
      return `${POD_URL}Passport/`;
    case 'Drivers License':
      return `${POD_URL}Drivers%20License/`;
    default:
      return null;
  }
};

/**
 * Function that setups ACL permissions for a Solid dataset or resource with an ACL file
 *
 * @memberof utils
 * @function setupAcl
 * @param {AclDataset} resourceWithAcl - A Solid Session Dataset with ACL file
 * @param {string} webId - Solid webId
 * @param {Access} accessObject - Solid Access Object which sets ACL permission for
 * read, append, write, and control
 * @returns {AclDataset} - Solid Session Dataset with updated ACL file
 */

export const setupAcl = (resourceWithAcl, webId, accessObject) => {
  // setAgentResourceAccess will set ACL for resource and setAgentDefaultAcess will set ACL for resource container
  let acl = setAgentResourceAccess(resourceWithAcl, webId, accessObject);
  acl = setAgentDefaultAccess(acl, webId, accessObject);

  return acl;
};

/**
 * Function that generates ACL file for container containing a specific document type
 * and turtle file and give the user access and control to the Solid container
 *
 * @memberof utils
 * @function createDocAclForUser
 * @param {Session} session - Solid's Session Object
 * @param {string} documentUrl - Url link to document container
 * @returns {Promise} Promise - Generates ACL file for container and give user access
 * and control to it and its contents
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
