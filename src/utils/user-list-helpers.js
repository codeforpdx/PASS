import {
  getSolidDataset,
  createThing,
  buildThing,
  setThing,
  createSolidDataset,
  getThingAll,
  saveSolidDatasetAt,
  getStringNoLocale,
  getUrl,
  removeThing
} from '@inrupt/solid-client';

import {
  getContainerUrl,
  createDocAclForUser
} from './session-helper';

import { RDF_PREDICATES } from '../constants';

/**
 * @typedef {import('@inrupt/solid-ui-react').SessionContext} Session
 */

/**
 * @typedef {import("../typedefs").userListObject} userListObject
 */

const createUsersList = async (session, usersListUrl) => {
  const newUsersList = buildThing(createThing({ name: 'userlist' }))
    .addStringNoLocale(RDF_PREDICATES.name, 'Users List')
    .addStringNoLocale(RDF_PREDICATES.description, 'A list of users')
    .build();

  let newSolidDataset = createSolidDataset();
  newSolidDataset = setThing(newSolidDataset, newUsersList);

  // Generate document.ttl file for container
  const usersListDataset = await saveSolidDatasetAt(usersListUrl, newSolidDataset, {
    contentType: 'text/turtle',
    fetch: session.fetch
  });

  // Generate ACL file for container
  await createDocAclForUser(session, usersListUrl);
  return usersListDataset;
}

/**
 * Fetch users list from user's pod.
 * If the list does not exist, create it.
 *
 * @memberof utils
 * @function fetchUsersList
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {URL} podUrl - Url of pod to fetch data from
 * @returns {Promise} Promise - resolves to a users list object
 */
export const fetchUsersList = async (session, podUrl) => {
  const usersListUrl = `${podUrl}Users/userlist.ttl`

  try {
    await getSolidDataset(usersListUrl, { fetch: session.fetch });
  }
  catch {
    await createUsersList(session, usersListUrl);
  }
};

const parseUserObjectFromThing = (userThing) => {
  const person = getStringNoLocale(userThing, RDF_PREDICATES.Person);
  const givenName = getStringNoLocale(userThing, RDF_PREDICATES.givenName);
  const familyName = getStringNoLocale(userThing, RDF_PREDICATES.familyName);
  const webId = getUrl(userThing, RDF_PREDICATES.url);

  return {person, givenName, familyName, webId};
}

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

    const allUsersThing = getThingAll(solidDataset).filter(
      (thing) => !thing.url.includes('#userlist')
    );

    allUsersThing.forEach((userThing) => {
      const userObject = parseUserObjectFromThing(userThing);
      userList.push(userObject);
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

  const { givenName, familyName, username, webId } = userObject;

  const newUserThing = buildThing(createThing({ name: `${givenName} ${username}` }))
    .addStringNoLocale(RDF_PREDICATES.Person, `${givenName} ${familyName}`)
    .addStringNoLocale(RDF_PREDICATES.givenName, givenName)
    .addStringNoLocale(RDF_PREDICATES.familyName, familyName)
    .addUrl(RDF_PREDICATES.url, webId)
    .build();

  solidDataset = setThing(solidDataset, newUserThing);

  await saveSolidDatasetAt(`${userContainerUrl}userlist.ttl`, solidDataset, {
    fetch: session.fetch
  });

  const userList = await getUsersFromPod(session);
  return userList;
};