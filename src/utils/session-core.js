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
  saveAclFor,
  getSolidDatasetWithAcl,
  getResourceAcl,
  overwriteFile,
  getThingAll,
  saveSolidDatasetAt,
  getStringNoLocale
} from '@inrupt/solid-client';
import { SCHEMA_INRUPT } from '@inrupt/vocab-common-rdf';
import {
  getContainerUrl,
  setupAcl,
  placeFileInContainer,
  getContainerUrlAndFiles,
  hasTTLFiles,
  createDocAclForUser,
  updateTTLFile,
  getUserListActivity
} from './session-helper';

/**
 * @typedef {import('@inrupt/solid-ui-react').SessionContext} Session
 */

/**
 * @typedef {import('../typedefs').fileObjectType} fileObjectType
 */

/**
 * @typedef {import("../typedefs").userListObject} userListObject
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
 * @param {string} fetchType - Type of fetch (to own Pod, or "self-fetch" or to
 * other Pods, or "cross-fetch")
 * @param {URL} otherPodUrl - Url to other user's Pod or empty string
 * @returns {Promise} Promise - Sets permission for otherPodUrl for given
 * document type, if exists, or null
 */

export const setDocAclPermission = async (session, fileType, accessType, otherPodUrl) => {
  const documentUrl = getContainerUrl(session, fileType, 'self-fetch');

  const podResouceWithAcl = await getSolidDatasetWithAcl(documentUrl, { fetch: session.fetch });

  const resourceAcl = getResourceAcl(podResouceWithAcl);
  const webId = `https://${otherPodUrl}/profile/card#me`;
  let accessObject;
  switch (accessType) {
    case 'Give':
      accessObject = { read: true };
      break;
    default:
      accessObject = { read: false };
      break;
  }

  const updatedAcl = setupAcl(resourceAcl, webId, accessObject);
  await saveAclFor(podResouceWithAcl, updatedAcl, { fetch: session.fetch });
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
 * @param {fileObjectType} fileObject - Object containing information about file
 * from form submission (see {@link fileObjectType})
 * @returns {Promise} Promise - File upload is handled via Solid libraries
 */

// Main function to upload document to user's Pod on Solid
export const uploadDocument = async (session, fileObject) => {
  const documentUrl = getContainerUrl(session, fileObject.type, 'self-fetch');
  await createContainerAt(documentUrl, { fetch: session.fetch });

  const datasetFromUrl = await getSolidDataset(documentUrl, { fetch: session.fetch });
  const ttlFileExists = hasTTLFiles(datasetFromUrl);

  // Guard clause will throw function if container already exist with ttl file
  if (ttlFileExists) {
    throw new Error('Container already exist. Updating files inside...');
  }

  // Place file into Pod container and generate new ttl file for container
  await placeFileInContainer(session, fileObject, documentUrl);
  const newTtlFile = buildThing(createThing({ name: 'document' }))
    .addDatetime('https://schema.org/uploadDate', new Date())
    .addStringNoLocale(SCHEMA_INRUPT.name, fileObject.file.name)
    .addStringNoLocale(SCHEMA_INRUPT.identifier, fileObject.type)
    .addStringNoLocale(SCHEMA_INRUPT.endDate, fileObject.date)
    .addStringNoLocale(SCHEMA_INRUPT.description, fileObject.description)
    .addUrl(SCHEMA_INRUPT.url, `${documentUrl}${fileObject.file.name}`)
    .build();

  // const clientInfoThing = buildThing(createThing({ name: 'owner' }))
  //   .addStringNoLocale(SCHEMA_INRUPT.givenName, 'Alice')
  //   .addStringNoLocale(SCHEMA_INRUPT.familyName, 'Young')
  //   .addUrl('https://schema.org/owns', `${documentUrl}${fileObject.file.name}`)
  //   .addUrl(SCHEMA_INRUPT.url, 'https://testuser.opencommons.net/profile/card#me')
  //   .build();

  let newSolidDataset = createSolidDataset();
  newSolidDataset = setThing(newSolidDataset, newTtlFile);
  // newSolidDataset = setThing(newSolidDataset, clientInfoThing);

  // Generate document.ttl file for container
  await saveSolidDatasetInContainer(documentUrl, newSolidDataset, {
    slugSuggestion: 'document.ttl',
    contentType: 'text/turtle',
    fetch: session.fetch
  });

  // Generate ACL file for container
  await createDocAclForUser(session, documentUrl);
};

/**
 * Function that update file to Pod on Solid
 *
 * @memberof utils
 * @function updateDocument
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {fileObjectType} fileObject - Object containing information about file
 * from form submission (see {@link fileObjectType})
 * @returns {Promise} fileExist - A boolean for if file exist on Solid Pod,
 * updates the file if confirmed, or if file doesn't exist, uploads new file to
 * Solid Pod if confirmed
 */

export const updateDocument = async (session, fileObject) => {
  const documentUrl = getContainerUrl(session, fileObject.type, 'self-fetch');
  const solidDataset = await getSolidDataset(documentUrl, { fetch: session.fetch });

  // Checks for file in Solid Pod
  const [, files] = getContainerUrlAndFiles(solidDataset);
  const fileName = fileObject.file.name;
  const fileExist = files.map((file) => file.url).includes(`${documentUrl}${fileName}`);

  if (fileExist) {
    if (window.confirm(`File ${fileName} exist in Pod container, do you wish to update it?`)) {
      await overwriteFile(`${documentUrl}${fileName}`, fileObject.file, { fetch: session.fetch });
      await updateTTLFile(session, documentUrl, fileObject);
    } else {
      throw new Error('File update cancelled.');
    }

    return fileExist;
  }

  if (
    window.confirm(`File ${fileName} does not exist in Pod container, do you wish to upload it?`)
  ) {
    await overwriteFile(`${documentUrl}${fileName}`, fileObject.file, { fetch: session.fetch });
    await updateTTLFile(session, documentUrl, fileObject);
  } else {
    throw new Error('New file upload cancelled.');
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
 * @param {string} fetchType - Type of fetch (to own Pod, or "self-fetch" or to
 * other Pods, or "cross-fetch")
 * @param {URL} [otherPodUrl] - Url to other user's Pod (set to empty string by
 * default)
 * @returns {Promise} Promise - Either a string containing the url location of
 * the document, if exist, or throws an Error
 */

export const getDocuments = async (session, fileType, fetchType, otherPodUrl = '') => {
  const documentUrl = getContainerUrl(session, fileType, fetchType, otherPodUrl);

  try {
    await getSolidDataset(documentUrl, { fetch: session.fetch });

    return documentUrl;
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
 * @returns {Promise} container.url - The URL of document container and the
 * response on whether document file is deleted, if exist, and delete all
 * existing files within it
 */

export const deleteDocumentFile = async (session, fileType) => {
  const documentUrl = getContainerUrl(session, fileType, 'self-fetch');

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

/*
  User List Section

  Functions here deal primarily with the user list from Solid Pod and from PASS
*/

/**
 * Function that creates a Users container in the user's Pod when logging in for
 * the first time and creates a userlist.ttl file inside to store a users list
 *
 * @memberof utils
 * @function generateUsersList
 * @param {Session} session - Solid's Session Object {@link Session}
 * @returns {Promise} Promise - Generates a users list for Pod upon log in if
 * user's Pod does not have the container Users with userlist.ttl to begin with
 */

export const generateUsersList = async (session) => {
  const userContainerUrl = getContainerUrl(session, 'none', 'self-fetch');
  await createContainerAt(userContainerUrl, { fetch: session.fetch });

  const datasetFromUrl = await getSolidDataset(userContainerUrl, { fetch: session.fetch });
  const ttlFileExists = hasTTLFiles(datasetFromUrl);

  if (!ttlFileExists) {
    const newTtlFile = buildThing(createThing({ name: 'userlist' }))
      .addStringNoLocale(SCHEMA_INRUPT.Person, JSON.stringify([]))
      .build();

    let newSolidDataset = createSolidDataset();
    newSolidDataset = setThing(newSolidDataset, newTtlFile);

    // Generate document.ttl file for container
    await saveSolidDatasetInContainer(userContainerUrl, newSolidDataset, {
      slugSuggestion: 'userlist.ttl',
      contentType: 'text/turtle',
      fetch: session.fetch
    });

    // Generate ACL file for container
    await createDocAclForUser(session, userContainerUrl);
  }
};

/**
 * Function that gets a list of users from their Solid Pod stored inside the
 * Solid container named User
 *
 * @memberof utils
 * @function getUsersFromPod
 * @param {Session} session - Solid's Session Object {@link Session}
 * @returns {Promise} Promise - An array of users from their Pod into PASS, if
 * users list exist
 */

export const getUsersFromPod = async (session) => {
  const userContainerUrl = getContainerUrl(session, 'none', 'self-fetch');
  let userList;
  try {
    const solidDataset = await getSolidDataset(`${userContainerUrl}userlist.ttl`, {
      fetch: session.fetch
    });

    const ttlFileThing = getThingAll(solidDataset)[0];
    const userListString = getStringNoLocale(ttlFileThing, SCHEMA_INRUPT.Person);
    userList = JSON.parse(userListString);
    userList = await getUserListActivity(session, userList);
  } catch {
    userList = [];
  }

  return userList;
};

/**
 * Function that removes a user from the users list from their Solid Pod stored
 * inside the Solid container named User
 *
 * @memberof utils
 * @function deleteUserFromPod
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {string} userToDelete - Name of user to be removed from list
 * @returns {Promise} Promise - Removes user with otherPodUrl from users list in
 * their Solid Pod
 */

export const deleteUserFromPod = async (session, userToDelete) => {
  const userContainerUrl = getContainerUrl(session, 'none', 'self-fetch');
  let solidDataset = await getSolidDataset(`${userContainerUrl}userlist.ttl`, {
    fetch: session.fetch
  });
  let ttlFileThing = getThingAll(solidDataset)[0];
  const userListString = getStringNoLocale(ttlFileThing, SCHEMA_INRUPT.Person);
  const userListParsed = JSON.parse(userListString).filter((user) => user.name !== userToDelete);

  ttlFileThing = buildThing(ttlFileThing)
    .setStringNoLocale(SCHEMA_INRUPT.Person, JSON.stringify(userListParsed))
    .build();
  solidDataset = setThing(solidDataset, ttlFileThing);

  await saveSolidDatasetAt(`${userContainerUrl}userlist.ttl`, solidDataset, {
    fetch: session.fetch
  });

  const userList = await getUsersFromPod(session);
  return userList;
};

/**
 * Function that adds a user from the users list from their Solid Pod stored
 * inside the Solid container named User, or create the container User with the
 * user if container doesn't exist to begin with
 *
 * @memberof utils
 * @function addUserToPod
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {object} userObject - Object containing the user's name and Pod URL
 * @returns {Promise} Promise - Adds users with otherPodUrl from users list in
 * their Solid Pod
 */

export const addUserToPod = async (session, userObject) => {
  const userContainerUrl = getContainerUrl(session, 'none', 'self-fetch');

  let solidDataset = await getSolidDataset(`${userContainerUrl}userlist.ttl`, {
    fetch: session.fetch
  });
  let ttlFileThing = getThingAll(solidDataset)[0];
  const userListString = getStringNoLocale(ttlFileThing, SCHEMA_INRUPT.Person);
  const userListParsed = JSON.parse(userListString).concat(userObject);

  ttlFileThing = buildThing(ttlFileThing)
    .setStringNoLocale(SCHEMA_INRUPT.Person, JSON.stringify(userListParsed))
    .build();
  solidDataset = setThing(solidDataset, ttlFileThing);

  await saveSolidDatasetAt(`${userContainerUrl}userlist.ttl`, solidDataset, {
    fetch: session.fetch
  });

  const userList = await getUsersFromPod(session);
  return userList;
};

/*
  User Activity Section

  Functions here deal primarily with user activity on PASS
*/

/**
 * Function that creates an active.ttl file inside public container to store
 * only the time of the latest user's activity
 *
 * @memberof utils
 * @function generateActivtyTTL
 * @param {Session} session - Solid's Session Object {@link Session}
 * @returns {Promise} Promise - Generates active.ttl inside public which stores
 * the time of their latest activity on their Pod through PASS
 */

export const generateActivityTTL = async (session) => {
  const POD_URL = String(session.info.webId.split('profile')[0]);
  const publicContainerUrl = `${POD_URL}public/`;
  const datasetFromUrl = await getSolidDataset(publicContainerUrl, { fetch: session.fetch });
  const ttlFileExists = hasTTLFiles(datasetFromUrl);

  if (!ttlFileExists) {
    const newTtlFile = buildThing(createThing({ name: 'active' }))
      .addDatetime(SCHEMA_INRUPT.dateModified, new Date())
      .build();

    let newSolidDataset = createSolidDataset();
    newSolidDataset = setThing(newSolidDataset, newTtlFile);

    // Generate document.ttl file for container
    await saveSolidDatasetInContainer(publicContainerUrl, newSolidDataset, {
      slugSuggestion: 'active.ttl',
      contentType: 'text/turtle',
      fetch: session.fetch
    });

    // Generate ACL file for container
    await createDocAclForUser(session, publicContainerUrl);
  }
};

/**
 * Function that updates a user's last active time on Solid Pod
 *
 * @memberof utils
 * @function updateUserActivity
 * @param {Session} session - Solid's Session Object {@link Session}
 * @returns {Promise} Promise - Updates last active time of user to lastActive.ttl
 */

export const updateUserActivity = async (session) => {
  const POD_URL = String(session.info.webId.split('profile')[0]);
  const publicContainerUrl = `${POD_URL}public/`;
  let solidDataset = await getSolidDataset(`${publicContainerUrl}active.ttl`, {
    fetch: session.fetch
  });

  let ttlFileThing = getThingAll(solidDataset)[0];
  ttlFileThing = buildThing(ttlFileThing)
    .setDatetime(SCHEMA_INRUPT.dateModified, new Date())
    .build();
  solidDataset = setThing(solidDataset, ttlFileThing);

  await saveSolidDatasetAt(`${publicContainerUrl}active.ttl`, solidDataset, {
    fetch: session.fetch
  });
};
