import {
  buildThing,
  createThing,
  setThing,
  saveSolidDatasetAt,
  getSolidDataset,
  createSolidDataset,
  getPodUrlAll,
  getStringNoLocale,
  getUrl,
  getThing
} from '@inrupt/solid-client';
import { RDF_PREDICATES } from '../constants';

import { setDocAclForUser } from '../utils/network/session-helper';

/**
 * @typedef {import('@inrupt/solid-ui-react').SessionContext} Session
 */

/**
 * @typedef {import("@inrupt/solid-client").Thing} Thing
 */

/**
 * @typedef {import("@inrupt/solid-client").ThingLocal} ThingLocal
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
  const activityDocUrl = `${podUrl}PASS/Public/active.ttl`;
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

  const saveActivity = async (ttlFile) => {
    activityDataset = setThing(activityDataset, ttlFile);

    await saveSolidDatasetAt(activityDocUrl, activityDataset, {
      fetch: session.fetch
    });
  };

  try {
    activityDataset = await getSolidDataset(activityDocUrl, { fetch: session.fetch });
    const activeTTLThing = getThing(activityDataset, `${activityDocUrl}#active`);

    const activeTTL = buildThing(activeTTLThing)
      .setDatetime(RDF_PREDICATES.dateModified, new Date())
      .build();

    await saveActivity(activeTTL);
  } catch {
    const newActiveTTL = buildThing(createThing({ name: 'active' }))
      .addDatetime(RDF_PREDICATES.dateModified, new Date())
      .build();

    activityDataset = createSolidDataset();
    await saveActivity(newActiveTTL);

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
 * Creates a user object from a provided form submission
 *
 * @memberof User
 * @function createUser
 * @param {object} userSubmission - an object from a form submission containing the user creation data
 * @returns {Promise<object>} Promise - Updates last active time of user to lastActive.ttl
 */
export const createUser = async (userSubmission) => {
  const { familyName, username, givenName, webId } = userSubmission;

  let newUserPodUrl = null;
  try {
    [newUserPodUrl] = await getPodUrlAll(webId);
  } catch {
    [newUserPodUrl] = webId.split('profile');
  }
  newUserPodUrl = newUserPodUrl || webId.split('profile')[0];

  return {
    familyName,
    username,
    givenName,
    webId,
    podUrl: newUserPodUrl
  };
};

/**
 * Converts an inrupt Thing taken from the users list into a user object
 *
 * @memberof User
 * @function parseUserFromThing
 * @param {import('@inrupt/solid-client').Thing} userThing - the Thing to build the user from
 * @returns {object} user object
 */
export const parseUserFromThing = (userThing) => {
  const person = getStringNoLocale(userThing, RDF_PREDICATES.Person);
  const givenName = getStringNoLocale(userThing, RDF_PREDICATES.givenName);
  const familyName = getStringNoLocale(userThing, RDF_PREDICATES.familyName);
  const username = getStringNoLocale(userThing, RDF_PREDICATES.alternateName);
  const webId = getUrl(userThing, RDF_PREDICATES.identifier);
  const podUrl = getUrl(userThing, RDF_PREDICATES.URL);
  return { person, username, givenName, familyName, webId, podUrl };
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
 * @returns {ThingLocal} - resulting thing to be stored
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
