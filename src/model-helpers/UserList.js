import {
  getSolidDataset,
  createThing,
  buildThing,
  setThing,
  createSolidDataset,
  getThingAll,
  getThing,
  saveSolidDatasetAt,
  removeThing
} from '@inrupt/solid-client';

import { setDocAclForUser } from '../utils/network/session-helper';

import { RDF_PREDICATES } from '../constants';

import { parseUserFromThing, makeUserIntoThing } from './User';

/**
 * @typedef {import('@inrupt/solid-ui-react').SessionContext} Session
 */

/**
 * @typedef {import("../typedefs").userListObject} userListObject
 */

/**
 * @typedef {import("@inrupt/solid-client").SolidDataset} SolidDataset
 */

/**
 * Converts a users array into a userslist Thing stored in the provided dataset
 * If no dataset is provided, a new one is created
 *
 * @memberof UserList
 * @function makeIntoDataset
 * @param {Array} usersList - an array of users objects to add to a dataset
 * @param {SolidDataset} dataset - dataset to convert to array
 * @returns {object} An new userListObject containing any updates
 */
const makeIntoDataset = (usersList, dataset = createSolidDataset()) => {
  const usersListHeader = buildThing(createThing({ name: 'userlist' }))
    .addStringNoLocale(RDF_PREDICATES.name, 'Users List')
    .addStringNoLocale(RDF_PREDICATES.description, 'A list of users')
    .build();

  let usersDataset = dataset;
  usersDataset = setThing(usersDataset, usersListHeader);
  usersList.forEach((user) => {
    usersDataset = setThing(usersDataset, makeUserIntoThing(user));
  });

  return usersDataset;
};

/**
 * Converts a usersList dataset into an array of users.
 * Also fetches the users' activity records
 *
 * @memberof UserList
 * @function parseFromDataset
 * @param {SolidDataset} usersDataset - dataset to convert to array
 * @returns {object} An new userListObject containing any updates
 */
const parseFromDataset = async (usersDataset) => {
  const userList = [];
  const allUsersThing = getThingAll(usersDataset).filter(
    (thing) => !thing.url.includes('#userlist')
  );
  allUsersThing.map(async (userThing) => {
    const userObject = parseUserFromThing(userThing);
    userList.push(userObject);
  });

  return userList;
};

/**
 * Saves a user list to the user's pod
 *
 * @memberof UserList
 * @function saveToPod
 * @param {Session} session - session to use for saving
 * @param {object} userListObject - object containing userList, dataset, and listUrl
 * @param {SolidDataset} userListObject.dataset - dataset to save
 * @param {URL} userListObject.listUrl - Url of dataset to save to
 * @returns {object} An new userListObject containing any updates
 */
export const saveToPod = async (session, { dataset, listUrl }) => {
  const newDataset = await saveSolidDatasetAt(listUrl, dataset, {
    fetch: session.fetch
  });
  const newList = await parseFromDataset(newDataset, session);
  return { dataset: newDataset, userList: newList, listUrl };
};

/**
 * Adds a user to the existing user list and saves the list to the pod
 *
 * @memberof UserList
 * @function addUser
 * @param {object} user - User to add to the user list
 * @param {Session} session - session to use for saving
 * @param {object} userListObject - object containing userList, dataset, and listUrl
 * @param {SolidDataset} userListObject.dataset - dataset to save
 * @param {URL} userListObject.listUrl - Url of dataset to save to
 * @param {Array} userListObject.userList - array of Users
 * @returns {object} An new userListObject containing any updates
 */
export const addUser = async (user, session, { userList, dataset, listUrl }) => {
  const userThing = makeUserIntoThing(user);
  const newUserObject = {
    userList: userList.concat([user]),
    dataset: setThing(dataset, userThing),
    listUrl
  };
  const newObj = await saveToPod(session, newUserObject);
  return newObj;
};

/**
 * Removes a user from the existing list and saves it to the pod
 *
 * @memberof UserList
 * @function removeUser
 * @param {object} user - User to remove from the user list
 * @param {Session} session - session to use for saving
 * @param {object} userListObject - object containing userList, dataset, and listUrl
 * @param {SolidDataset} userListObject.dataset - dataset to save
 * @param {URL} userListObject.listUrl - Url of dataset to save to
 * @param {Array} userListObject.userList - array of Users
 * @returns {object} An new userListObject containing any updates
 */
export const removeUser = async (user, session, { userList, dataset, listUrl }) => {
  const newList = userList.filter((u) => u.webId !== user.webId);
  const thingUrl = `${listUrl}#${user.username}`;
  const thingToRemove = getThing(dataset, thingUrl);
  const newDataset = removeThing(dataset, thingToRemove);
  const newUserObject = { userList: newList, dataset: newDataset, listUrl };
  const newObj = await saveToPod(session, newUserObject);
  return newObj;
};

/**
 * Loads a user list from a given pod. If the list does not exist,
 * it createst the list.
 *
 * @memberof UserList
 * @function LoadUserList
 * @param {Session} session - session to use for saving
 * @param {URL} podUrl - The url of the pod to load user list from
 * @returns {object} An new userListObject containing any updates
 */
export const loadUserList = async (session, podUrl) => {
  const listUrl = `${podUrl}PASS/Users/userlist.ttl`;
  let dataset;
  let userList;
  try {
    dataset = await getSolidDataset(listUrl, { fetch: session.fetch });
    userList = await parseFromDataset(dataset, session);
  } catch {
    dataset = makeIntoDataset([]);
    dataset = await saveSolidDatasetAt(listUrl, dataset, {
      fetch: session.fetch
    });
    userList = [];
    await setDocAclForUser(session, listUrl, 'create', session.info.webId);
  }
  return { dataset, userList, listUrl };
};
