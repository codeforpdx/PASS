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
  getStringNoLocale,
  getUrl,
  removeThing,
  getDatetime
} from '@inrupt/solid-client';
import { RDF_PREDICATES, UPLOAD_TYPES } from '../constants';
import {
  getContainerUrl,
  setupAcl,
  placeFileInContainer,
  getContainerUrlAndFiles,
  hasTTLFiles,
  createDocAclForUser,
  createResourceTtlFile,
  updateTTLFile,
  SOLID_IDENTITY_PROVIDER
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
 * @param {string} otherPodUsername - Username to other user's Pod or empty string
 * @returns {Promise} Promise - Sets permission for otherPodUsername for given
 * document type, if exists, or null
 */

export const setDocAclPermission = async (session, fileType, accessType, otherPodUsername) => {
  const documentUrl = getContainerUrl(session, fileType, 'self-fetch');

  const podResouceWithAcl = await getSolidDatasetWithAcl(documentUrl, { fetch: session.fetch });

  const resourceAcl = getResourceAcl(podResouceWithAcl);
  const webId = `https://${otherPodUsername}.${
    SOLID_IDENTITY_PROVIDER.split('/')[2]
  }/profile/card#me`;
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

/**
 * Function that sets permissions for a user's document container's ACL file
 *
 * @memberof utils
 * @function setDocContainerAclPermission
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {string} fileType - Type of document
 * @param {string} fetchType - Type of fetch (to own Pod, or "self-fetch" or to
 * other Pods, or "cross-fetch")
 * @param {string} otherPodUsername - Username to other user's Pod or empty string
 * @returns {Promise} Promise - Sets permission for otherPodUsername for given
 * document type, if exists, or null
 */

export const setDocContainerAclPermission = async (session, accessType, otherPodUsername) => {
  const containerUrl = getContainerUrl(session, 'Documents', 'self-fetch');
  const urlsToSet = [
    containerUrl,
    `${containerUrl}Bank%20Statement/`,
    `${containerUrl}Passport/`,
    `${containerUrl}Drivers%20License/`
  ];

  const webId = `https://${otherPodUsername}.${
    SOLID_IDENTITY_PROVIDER.split('/')[2]
  }/profile/card#me`;

  let accessObject;
  switch (accessType) {
    case 'Give':
      accessObject = { read: true, write: true, append: true };
      break;
    default:
      accessObject = { read: false, write: false, append: false };
      break;
  }

  urlsToSet.forEach(async (url) => {
    const podResourceWithAcl = await getSolidDatasetWithAcl(url, { fetch: session.fetch });
    const resourceAcl = getResourceAcl(podResourceWithAcl);
    const updatedAcl = setupAcl(resourceAcl, webId, accessObject);
    await saveAclFor(podResourceWithAcl, updatedAcl, { fetch: session.fetch });
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
 * @param {string} [otherPodUsername] - If cross pod interaction, this is the username of the
 * other user, set to an empty string by default
 * @returns {Promise} Promise - File upload is handled via Solid libraries
 */

// Main function to upload document to user's Pod on Solid
export const uploadDocument = async (session, uploadType, fileObject, otherPodUsername = '') => {
  let containerUrl;
  const fileName = fileObject.file.name;
  if (uploadType === UPLOAD_TYPES.SELF) {
    containerUrl = getContainerUrl(session, fileObject.type, 'self-fetch');
  } else {
    containerUrl = getContainerUrl(session, 'Documents', 'cross-fetch', otherPodUsername);
    containerUrl = `${containerUrl}${fileObject.type.replace(' ', '%20')}/`;
  }

  await createContainerAt(containerUrl, { fetch: session.fetch });

  const documentUrl = `${containerUrl}${fileName.replace(' ', '%20')}`;
  const datasetFromUrl = await getSolidDataset(containerUrl, { fetch: session.fetch });
  const ttlFileExists = hasTTLFiles(datasetFromUrl);

  // Guard clause will throw function if container already exist with ttl file
  if (ttlFileExists) {
    throw new Error('Container already exists');
  }

  // Place file into Pod container and generate new ttl file for container
  await placeFileInContainer(session, fileObject, containerUrl);
  // NOTE: consider putting your if (Drivers License) check here...
  const newTtlFile = await createResourceTtlFile(fileObject, documentUrl);

  let newSolidDataset = createSolidDataset();
  newSolidDataset = setThing(newSolidDataset, newTtlFile);

  // Generate document.ttl file for container
  await saveSolidDatasetInContainer(containerUrl, newSolidDataset, {
    slugSuggestion: 'document.ttl',
    contentType: 'text/turtle',
    fetch: session.fetch
  });

  if (uploadType === UPLOAD_TYPES.SELF) {
    // Generate ACL file for container
    await createDocAclForUser(session, containerUrl);
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
 * @param {string} [otherPodUsername] - If cross pod interaction, this is the URL of the
 * other user, set to an empty string by default
 * @returns {Promise} fileExist - A boolean for if file exist on Solid Pod,
 * updates the file if confirmed, or if file doesn't exist, uploads new file to
 * Solid Pod if confirmed
 */

export const updateDocument = async (session, uploadType, fileObject, otherPodUsername = '') => {
  let containerUrl;
  const fileName = fileObject.file.name;
  if (uploadType === UPLOAD_TYPES.SELF) {
    containerUrl = getContainerUrl(session, fileObject.type, 'self-fetch');
  } else {
    containerUrl = getContainerUrl(session, 'Documents', 'cross-fetch', otherPodUsername);
    containerUrl = `${containerUrl}${fileObject.type.replace(' ', '%20')}/`;
  }

  const documentUrl = `${containerUrl}${fileName}`;
  const solidDataset = await getSolidDataset(containerUrl, { fetch: session.fetch });

  // Checks for file in Solid Pod
  const [, files] = getContainerUrlAndFiles(solidDataset);
  const fileExist = files.map((file) => file.url).includes(documentUrl);

  if (fileExist) {
    if (window.confirm(`File ${fileName} exist in Pod container, do you wish to update it?`)) {
      await overwriteFile(documentUrl, fileObject.file, { fetch: session.fetch });
      await updateTTLFile(session, containerUrl, fileObject);
    } else {
      throw new Error('File update cancelled.');
    }

    return fileExist;
  }

  if (
    window.confirm(`File ${fileName} does not exist in Pod container, do you wish to upload it?`)
  ) {
    await overwriteFile(documentUrl, fileObject.file, { fetch: session.fetch });
    await updateTTLFile(session, containerUrl, fileObject);
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
 * @param {string} [otherPodUsername] - Url to other user's Pod (set to empty string by
 * default)
 * @returns {Promise} Promise - Either a string containing the url location of
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
 * Function that fetch the URL of the container containing a specific file
 * uploaded to a user's Pod on Solid, if exist
 *
 * @memberof utils
 * @function checkContainerPermission
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {string} fileType - Type of document
 * @param {string} fetchType - Type of fetch (to own Pod, or "self-fetch" or to
 * other Pods, or "cross-fetch")
 * @param {string} [otherPodUsername] - Username to other user's Pod (set to empty string by
 * default)
 * @returns {Promise} Promise - Either a string containing the url location of
 * the container, if permitted, or throws an Error
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

/**
 * Function that generates the Documents container for users
 *
 * @memberof utils
 * @param {Session} session - Solid's Session Object
 * @returns {Promise} Promise - Creates Documents container for storage of
 * documents being uploaded by authorized users
 */

export const createDocumentContainer = async (session) => {
  const userContainerUrl = getContainerUrl(session, 'Documents', 'self-fetch');
  await createContainerAt(userContainerUrl, { fetch: session.fetch });

  const datasetFromUrl = await getSolidDataset(userContainerUrl, { fetch: session.fetch });
  const ttlFileExists = hasTTLFiles(datasetFromUrl);

  if (!ttlFileExists) {
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
    await createDocAclForUser(session, userContainerUrl);
    createContainerList.forEach(async (url) => {
      await createDocAclForUser(session, url);
    });
  }
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
  const userContainerUrl = getContainerUrl(session, 'Users', 'self-fetch');
  await createContainerAt(userContainerUrl, { fetch: session.fetch });

  const datasetFromUrl = await getSolidDataset(userContainerUrl, { fetch: session.fetch });
  const ttlFileExists = hasTTLFiles(datasetFromUrl);

  if (!ttlFileExists) {
    const newTtlFile = buildThing(createThing({ name: 'userlist' }))
      .addStringNoLocale(RDF_PREDICATES.name, 'Users List')
      .addStringNoLocale(RDF_PREDICATES.description, 'A list of users')
      .addUrl(RDF_PREDICATES.url, `${userContainerUrl}userlist.ttl`)
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
 * Function that fetches a user's last active time on their Solid Pod
 *
 * @memberof utils
 * @function getUserListActivity
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {userListObject[]} userList - An array of {@link userListObject}
 * which stores the name and their Pod URL
 * @returns {Promise} Promise - An array of users with last active time included
 * to user list
 */

export const getUserListActivity = async (session, userList) => {
  const userListWithTime = await Promise.all(
    userList.map(async (user) => {
      try {
        const solidDataset = await getSolidDataset(
          `${user.podUrl.split('profile')[0]}public/active.ttl`,
          {
            fetch: session.fetch
          }
        );
        const activeTTLThing = getThingAll(solidDataset)[0];
        const lastActiveTime = getDatetime(activeTTLThing, RDF_PREDICATES.dateModified);
        user.dateModified = lastActiveTime;
        return user;
      } catch {
        return user;
      }
    })
  );

  return userListWithTime;
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
  const userContainerUrl = getContainerUrl(session, 'Users', 'self-fetch');
  let userList = [];
  try {
    const solidDataset = await getSolidDataset(`${userContainerUrl}userlist.ttl`, {
      fetch: session.fetch
    });

    const ttlFileThing = getThingAll(solidDataset);
    const allUsersThing = ttlFileThing.filter((thing) => !thing.url.includes('#userlist'));
    allUsersThing.forEach((userThing) => {
      const person = getStringNoLocale(userThing, RDF_PREDICATES.Person);
      const givenName = getStringNoLocale(userThing, RDF_PREDICATES.givenName);
      const familyName = getStringNoLocale(userThing, RDF_PREDICATES.familyName);
      const podUrl = getUrl(userThing, RDF_PREDICATES.url);

      userList.push({ person, givenName, familyName, podUrl });
    });
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
 * @param {URL} userToDeleteUrl - URL of the user's Pod you wish to delete
 * @returns {Promise} Promise - Removes user with userToDeleteUrl from users list in
 * their Solid Pod
 */

export const deleteUserFromPod = async (session, userToDelete, userToDeleteUrl) => {
  const userContainerUrl = getContainerUrl(session, 'Users', 'self-fetch');
  let solidDataset = await getSolidDataset(`${userContainerUrl}userlist.ttl`, {
    fetch: session.fetch
  });
  const ttlFileThing = getThingAll(solidDataset);
  const usernameString = userToDeleteUrl.split('.')[0].split('/')[2];
  const userToDeleteThing = ttlFileThing.find((thing) =>
    thing.url.includes(`#${userToDelete.replace(' ', '%20')}%20${usernameString}`)
  );

  solidDataset = removeThing(solidDataset, userToDeleteThing);

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
 * @returns {Promise} Promise - Adds users with their Pod URL onto users list in
 * their Solid Pod
 */

export const addUserToPod = async (session, userObject) => {
  const userContainerUrl = getContainerUrl(session, 'Users', 'self-fetch');

  let solidDataset = await getSolidDataset(`${userContainerUrl}userlist.ttl`, {
    fetch: session.fetch
  });

  const podUrl = `https://${userObject.username}.${SOLID_IDENTITY_PROVIDER.split('/')[2]}/`;

  const newUserThing = buildThing(
    createThing({ name: `${userObject.givenName} ${userObject.username}` })
  )
    .addStringNoLocale(RDF_PREDICATES.Person, `${userObject.givenName} ${userObject.familyName}`)
    .addStringNoLocale(RDF_PREDICATES.givenName, userObject.givenName)
    .addStringNoLocale(RDF_PREDICATES.familyName, userObject.familyName)
    .addUrl(RDF_PREDICATES.url, podUrl)
    .build();

  solidDataset = setThing(solidDataset, newUserThing);

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
      .addDatetime(RDF_PREDICATES.dateModified, new Date())
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
    .setDatetime(RDF_PREDICATES.dateModified, new Date())
    .build();
  solidDataset = setThing(solidDataset, ttlFileThing);

  await saveSolidDatasetAt(`${publicContainerUrl}active.ttl`, solidDataset, {
    fetch: session.fetch
  });
};

/*
  User Inbox Section

  Functions here deal primarily with user inbox on PASS
*/

/**
 * Function that sends a message to another user's Pod inbox
 *
 * @memberof utils
 * @function sendMessageTTL
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {object} messageObject - An object containing inputs for the the message
 * @param {string} otherPodUsername - The username of the other user you're sending a message to
 * @returns {Promise} Promise - Updates last active time of user to lastActive.ttl
 */

export const sendMessageTTL = async (session, messageObject, otherPodUsername) => {
  const containerUrl = getContainerUrl(session, 'Inbox', 'cross-fetch', otherPodUsername);
  const senderUsername = session.info.webId.split('profile')[0].split('/')[2].split('.')[0];

  const date = new Date();
  const dateYYYYMMDD = date.toISOString().split('T')[0].replace(/-/g, '');
  const dateISOTime = date.toISOString().split('T')[1].split('.')[0].replace(/:/g, '');

  const newTtlFile = buildThing(createThing({ name: 'document' }))
    .addDatetime('https://schema.org/uploadDate', date)
    .addStringNoLocale(SCHEMA_INRUPT.name, messageObject.file.name)
    .addStringNoLocale(SCHEMA_INRUPT.identifier, messageObject.type)
    .addStringNoLocale(SCHEMA_INRUPT.endDate, messageObject.date)
    .addStringNoLocale(SCHEMA_INRUPT.description, messageObject.description)
    .build();

  let newSolidDataset = createSolidDataset();
  newSolidDataset = setThing(newSolidDataset, newTtlFile);

  // Generate document.ttl file for container
  await saveSolidDatasetInContainer(containerUrl, newSolidDataset, {
    slugSuggestion: `requestPerms-${senderUsername}-${dateYYYYMMDD}-${dateISOTime}.ttl`,
    contentType: 'text/turtle',
    fetch: session.fetch
  });
};
