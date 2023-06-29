import {
  buildThing,
  createThing,
  getStringNoLocale,
  getThing,
  getWebIdDataset,
  removeStringNoLocale,
  removeThing,
  saveSolidDatasetAt,
  setThing
} from '@inrupt/solid-client';
import { RDF_PREDICATES } from '../constants';

/**
 * @typedef {import('@inrupt/solid-ui-react').SessionContext} Session
 */

/**
 * A function fetches the user's profile information from their webId's profile
 * card
 *
 * @function fetchProfileInfo
 * @param {Session} session - Solid's Session Object {@link Session}
 * @returns {Promise<object>} Object - The object containing the information related
 * to the person on their profile card, the profile dataset, and the profile Thing
 */
export const fetchProfileInfo = async (session) => {
  const profileDataset = await getWebIdDataset(session.info.webId);
  const profileThingMe = getThing(profileDataset, session.info.webId);
  const profileThingOrg = getThing(
    profileDataset,
    session.info.webId.replace('#me', '#organization')
  );

  const profileName = getStringNoLocale(profileThingMe, RDF_PREDICATES.profileName);
  const organization = profileThingOrg
    ? getStringNoLocale(profileThingOrg, RDF_PREDICATES.name)
    : null;

  const profileInfo = { profileName, organization };
  const profileThingAll = { profileThingMe, profileThingOrg };

  // TODO: include more fields to the object like organization, address, etc.
  // when expanding this feature
  return { profileInfo, profileDataset, profileThingAll };
};

/**
 * A function that updates the user's profile information based on what is inputed
 * in the Profile page
 *
 * @function updateProfileInfo
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {object} profileData - The object containing the information related
 * to the person on their profile card, the profile dataset, and the profile Thing
 * @param {object} inputValues - The inputs for updating profile information
 * on their profile card
 * @returns {Promise} Promise - Performs action to update profile card on the
 * user's profile card
 */
export const updateProfileInfo = async (session, profileData, inputValues) => {
  let { profileDataset } = profileData;
  const { profileInfo, profileThingAll } = profileData;
  let { profileThingMe } = profileThingAll;
  const { profileThingOrg } = profileThingAll;
  let newProfileThing;

  Object.keys(inputValues).forEach((input) => {
    switch (inputValues[input]) {
      case null:
      case 'null':
      case 'No value set':
        return;
      case '':
        if (input === 'organization') {
          profileDataset = removeThing(profileDataset, profileThingOrg);
        } else {
          profileThingMe = removeStringNoLocale(
            profileThingMe,
            RDF_PREDICATES[input],
            profileInfo[input]
          );
        }
        break;
      default:
        if (input === 'organization') {
          newProfileThing = buildThing(createThing({ name: 'organization' }))
            .addUrl(RDF_PREDICATES.type, RDF_PREDICATES.organization)
            .addStringNoLocale(RDF_PREDICATES.name, inputValues[input])
            .build();
        } else {
          profileThingMe = buildThing(profileThingMe)
            .setStringNoLocale(RDF_PREDICATES[input], inputValues[input])
            .build();
        }
        break;
    }
  });

  profileDataset = setThing(profileDataset, profileThingMe);

  if (!profileThingOrg) {
    profileDataset = setThing(profileDataset, newProfileThing);
  }

  await saveSolidDatasetAt(session.info.webId, profileDataset, { fetch: session.fetch });
};

/**
 * A function that saves the latest date user has logged into PASS as dateRead
 * inside user's profile card
 *
 * @function updateActivity
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {URL} webId - WebId of the user to update last login date in profile
 * card
 * @returns {Promise} Promise - Saves the latest date user has logged in PASS
 * into profile card as dateRead
 */
export const updateActivity = async (session, webId) => {
  let profileDataset = await getWebIdDataset(webId);
  let profileThing = getThing(profileDataset, webId);

  profileThing = buildThing(profileThing).setDate(RDF_PREDICATES.dateRead, new Date()).build();

  profileDataset = setThing(profileDataset, profileThing);

  await saveSolidDatasetAt(webId, profileDataset, { fetch: session.fetch });
};
