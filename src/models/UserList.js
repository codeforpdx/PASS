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
class UserList {
  constructor(dataset, list, podUrl) {
    this.dataset = dataset;
    this.list = list;
    this.listUrl = `${podUrl}Users/userlist.ttl`;
  }

  static makeIntoDataset(usersList, dataset = createSolidDataset()) {
    const usersListHeader = buildThing(createThing({ name: 'userlist' }))
      .addStringNoLocale(RDF_PREDICATES.name, 'Users List')
      .addStringNoLocale(RDF_PREDICATES.description, 'A list of users')
      .build();

    let usersDataset = dataset;
    usersDataset = setThing(usersDataset, usersListHeader);
    usersList.forEach((user) => {
      usersDataset = setThing(usersDataset, this.makeUserIntoThing(user));
    });

    return usersDataset;
  }

  static async parseFromDataset(usersDataset, session) {
    const userList = [];
    const allUsersThing = getThingAll(usersDataset).filter(
      (thing) => !thing.url.includes('#userlist')
    );
    await Promise.all(
      allUsersThing.map(async (userThing) => {
        const userObject = await parseUserFromThing(userThing, session);
        userList.push(userObject);
      })
    );

    return userList;
  }

  /**
   * Function that converts an array of users into a dataset,
   * then saves that dataset to the requested pod
   *
   * @memberof utils
   * @function saveUsersList
   * @param {Session} session - Inrupt's session object
   */
  async saveToPod(session) {
    this.dataset = await saveSolidDatasetAt(this.listUrl, this.dataset, {
      fetch: session.fetch
    });
    this.list = await UserList.parseFromDataset(this.dataset);
  }

  /**
   * Function that adds a user from the users list from their Solid Pod stored
   * inside the Solid container named User, or create the container User with the
   * user if container doesn't exist to begin with
   *
   * @memberof utils
   * @function addUserToUserList
   * @param {object} user - User to add to the user list
   */

  addUser(user) {
    this.list.push(user);
    const userThing = makeUserIntoThing(user);
    this.dataset = setThing(this.dataset, userThing);
  }

  removeUser(user) {
    this.list = this.list.filter((u) => u.webId !== user.webId);
    const thingUrl = `${this.listUrl}#${user.username}`;
    const thingToRemove = getThing(this.dataset, thingUrl);
    this.dataset = removeThing(this.dataset, thingToRemove);
  }

  async refreshList(session) {
    const dataset = getSolidDataset(this.listUrl, { fetch: session.fetch });
    const userList = await UserList.parseFromDataset(dataset, session);
    this.dataset = dataset;
    this.list = userList;
  }
}

export const LoadUserList = async (session, podUrl) => {
  const userListUrl = `${podUrl}Users/userlist.ttl`;
  let dataset;
  let userList;
  try {
    dataset = await getSolidDataset(userListUrl, { fetch: session.fetch });
    userList = await UserList.parseFromDataset(dataset, session);
  } catch {
    dataset = UserList.makeIntoDataset([]);
    dataset = await saveSolidDatasetAt(userListUrl, dataset, {
      fetch: session.fetch
    });
    userList = [];
    await setDocAclForUser(session, userListUrl, 'create', session.info.webId);
  }
  return new UserList(dataset, userList, podUrl);
};

export default UserList;
