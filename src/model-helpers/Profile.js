import {
  buildThing,
  createAcl,
  deleteFile,
  getFile,
  getStringNoLocale,
  getThing,
  getUrl,
  getWebIdDataset,
  removeStringNoLocale,
  removeUrl,
  saveAclFor,
  saveFileInContainer,
  saveSolidDatasetAt,
  setThing
} from '@inrupt/solid-client';
import { RDF_PREDICATES } from '../constants';
import { setupAcl } from '../utils';

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
  const profileThing = getThing(profileDataset, session.info.webId);

  const profileName = getStringNoLocale(profileThing, RDF_PREDICATES.profileName);
  const nickname = getStringNoLocale(profileThing, RDF_PREDICATES.nickname);
  const profileImage = getUrl(profileThing, RDF_PREDICATES.profileImg);

  const profileInfo = { profileName, nickname, profileImage };

  // TODO: include more fields to the object like organization, address, etc.
  // when expanding this feature
  return { profileInfo, profileDataset, profileThing };
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
  let { profileDataset, profileThing } = profileData;
  const { profileInfo } = profileData;

  Object.keys(inputValues).forEach((input) => {
    switch (inputValues[input]) {
      case null:
        return;
      case '':
        profileThing = removeStringNoLocale(
          profileThing,
          RDF_PREDICATES[input],
          profileInfo[input]
        );
        break;
      default:
        profileThing = buildThing(profileThing)
          .setStringNoLocale(RDF_PREDICATES[input], inputValues[input])
          .build();
        break;
    }
  });

  profileDataset = setThing(profileDataset, profileThing);

  await saveSolidDatasetAt(session.info.webId, profileDataset, { fetch: session.fetch });
};

/**
 * Function that upload profile image of user onto their profile container and
 * reference it on their Pod
 *
 * @function uploadProfileImage
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {object} profileData - The object containing the information related
 * to the person on their profile card, the profile dataset, and the profile Thing
 * @param {Blob} inputImage - File blob being uploaded for profile image
 * @returns {Promise} Promise - Performs a file upload of your profile image onto
 * your pod at /profile
 */
export const uploadProfileImage = async (session, profileData, inputImage) => {
  let { profileDataset, profileThing } = profileData;

  const profileContainer = `${session.info.webId.split('card')[0]}`;
  let profileImgFilename = inputImage.name.replace(' ', '%20');

  if (profileImgFilename.endsWith('.jpg')) {
    profileImgFilename = profileImgFilename.replace('.jpg', '.jpeg');
  }

  await saveFileInContainer(profileContainer, inputImage, {
    slug: profileImgFilename,
    contentType: inputImage.type,
    fetch: session.fetch
  });

  profileThing = buildThing(profileThing)
    .addUrl(RDF_PREDICATES.profileImg, `${profileContainer}${profileImgFilename}`)
    .build();

  profileDataset = setThing(profileDataset, profileThing);

  await saveSolidDatasetAt(session.info.webId, profileDataset, { fetch: session.fetch });

  // Create ACL file for profile image
  const imageResource = await getFile(
    `${session.info.webId.split('card')[0]}${profileImgFilename}`,
    { fetch: session.fetch }
  );

  const resourceAcl = createAcl(imageResource);
  const newAcl = setupAcl(
    resourceAcl,
    session.info.webId,
    { read: true, write: true, control: true }, // personal access
    { read: true } // public access
  );
  await saveAclFor(imageResource, newAcl, { fetch: session.fetch });
};

/**
 * Function that removes the profile image being used on their Pod and removes
 * the field for profile image
 *
 * @function removeProfileImage
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {object} profileData - The object containing the information related
 * to the person on their profile card, the profile dataset, and the profile Thing
 * @returns {Promise} Promise - Perform action that removes the profile image from
 * the profile card and the profile image
 */
export const removeProfileImage = async (session, profileData) => {
  let { profileDataset, profileThing } = profileData;
  const profileImg = getUrl(profileThing, RDF_PREDICATES.profileImg);

  if (profileImg) {
    profileThing = removeUrl(profileThing, RDF_PREDICATES.profileImg, profileImg);

    profileDataset = setThing(profileDataset, profileThing);
    await saveSolidDatasetAt(session.info.webId, profileDataset, { fetch: session.fetch });

    await deleteFile(profileImg, { fetch: session.fetch });
  }
};
