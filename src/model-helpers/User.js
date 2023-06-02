import {
  buildThing,
  createThing,
  setThing,
  saveSolidDatasetAt,
  getSolidDataset,
  createSolidDataset,
  getThingAll,
  getDatetime,
  getPodUrlAll,
  getStringNoLocale,
  getUrl
} from '@inrupt/solid-client';
import { RDF_PREDICATES } from '../constants';

import { setDocAclForUser } from '../utils/network/session-helper';

/**
 * @typedef {import('@inrupt/solid-ui-react').SessionContext} Session
 */

/**
 * Function that updates a user's last active time on Solid Pod
 *
 * @memberof User
 * @function updateUserActivity
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {URL} podUrl - the url of the user's pod to update
 * @returns {Promise} Promise - Updates last active time of user to lastActive.ttl
 */
export const updateUserActivity = async (session, podUrl) => {
  const activityDocUrl = `${podUrl}public/active.ttl`;
  const accessObject = {
    read: true,
    append: true,
    write: true,
    control: true
  };
  const publicAccessObject = {
    read: true,
    append: false,
    write: false,
    control: false
  };
  let activityDataset;

  const updateAndSaveActivity = async () => {
    const activity = buildThing(createThing({ name: 'active' }))
      .addDatetime(RDF_PREDICATES.dateModified, new Date())
      .build();

    activityDataset = setThing(activityDataset, activity);

    await saveSolidDatasetAt(activityDocUrl, activityDataset, {
      fetch: session.fetch
    });
  };

  try {
    activityDataset = await getSolidDataset(activityDocUrl, { fetch: session.fetch });
    await updateAndSaveActivity();
  } catch {
    activityDataset = createSolidDataset();
    await updateAndSaveActivity();

    await setDocAclForUser(
      session,
      activityDocUrl,
      'create',
      session.info.webId,
      accessObject,
      publicAccessObject
    );
  }
};

/**
 * Fetches the last time a user was active in pass
 *
 * @memberof User
 * @function loadUserActivity
 * @param {URL} podUrl - Url of user's pod to fetch from
 * @param {Session} session - Solid's Session Object {@link Session}
 * @returns {string} last time the user was active in PASS
 */
const loadUserActivity = async (podUrl, session) => {
  const activityUrl = `${podUrl}public/active.ttl`;
  try {
    const solidDataset = await getSolidDataset(activityUrl, {
      fetch: session.fetch
    });
    const activeThing = getThingAll(solidDataset)[0];
    return getDatetime(activeThing, RDF_PREDICATES.dateModified);
  } catch {
    return null;
  }
};

/**
 * Creates a user object from a provided form submission
 *
 * @memberof User
 * @function createUser
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {object} userSubmission - an object from a form submission containing the user creation data
 * @returns {Promise} Promise - Updates last active time of user to lastActive.ttl
 */
export const createUser = async (session, userSubmission) => {
  const { familyName, username, givenName, webId } = userSubmission;

  let newUserPodUrl = null;
  try {
    [newUserPodUrl] = await getPodUrlAll(webId);
  } catch {
    [newUserPodUrl] = webId.split('profile');
  }
  newUserPodUrl = newUserPodUrl || webId.split('profile')[0];

  const dateModified = await loadUserActivity(newUserPodUrl, session);

  return {
    familyName,
    username,
    givenName,
    webId,
    dateModified,
    podUrl: newUserPodUrl
  };
};

/**
 * Converts an inrupt Thing taken from the users list into a user object
 *
 * @memberof User
 * @function parseUserFromThing
 * @param {import('@inrupt/solid-client').Thing} userThing - the Thing to build the user from
 * @param {Session} session - Solid's Session Object {@link Session}
 * @returns {object} user object
 */
export const parseUserFromThing = async (userThing, session) => {
  const person = getStringNoLocale(userThing, RDF_PREDICATES.Person);
  const givenName = getStringNoLocale(userThing, RDF_PREDICATES.givenName);
  const familyName = getStringNoLocale(userThing, RDF_PREDICATES.familyName);
  const username = getStringNoLocale(userThing, RDF_PREDICATES.alternateName);
  const webId = getUrl(userThing, RDF_PREDICATES.identifier);
  const podUrl = getUrl(userThing, RDF_PREDICATES.URL);
  const dateModified = await loadUserActivity(podUrl, session);
  return { person, username, givenName, familyName, webId, podUrl, dateModified };
};

/**
 * Convert a user object into an inrupt Thing
 * to be stored in the users list
 *
 * @memberof User
 * @function makeUserIntoThing
 * @param {object} userObject - user object
 * @param {string} userObject.username - username
 * @param {string} userObject.givenName - given name
 * @param {string} userObject.familyName - family name
 * @param {string} userObject.webId - web id
 * @param {string} userObject.podUrl - pod url
 * @returns {import('@inrupt/solid-client').Thing} - resulting thing to be stored
 */
export const makeUserIntoThing = ({ username, givenName, familyName, webId, podUrl }) =>
  buildThing(createThing({ name: username }))
    .addStringNoLocale(RDF_PREDICATES.Person, `${givenName} ${familyName}`)
    .addStringNoLocale(RDF_PREDICATES.givenName, givenName)
    .addStringNoLocale(RDF_PREDICATES.familyName, familyName)
    .addStringNoLocale(RDF_PREDICATES.alternateName, username)
    .addUrl(RDF_PREDICATES.identifier, webId)
    .addUrl(RDF_PREDICATES.URL, podUrl)
    .build();
