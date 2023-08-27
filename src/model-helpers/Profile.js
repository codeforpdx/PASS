import {
  buildThing,
  createAcl,
  createSolidDataset,
  createThing,
  deleteFile,
  getDate,
  getFile,
  getSolidDataset,
  getSourceUrl,
  getStringNoLocale,
  getThing,
  getUrl,
  getWebIdDataset,
  removeStringNoLocale,
  removeDate,
  removeUrl,
  saveAclFor,
  saveFileInContainer,
  saveSolidDatasetAt,
  setThing
} from '@inrupt/solid-client';
import { RDF_PREDICATES } from '../constants';
import { saveSourceUrlToThing, setupAcl } from '../utils';

/**
 * @typedef {import('@inrupt/solid-client-authn-browser').Session} Session
 */

/**
 * A function fetches the user's profile information from their webId's profile
 * card
 *
 * @function fetchProfileInfo
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {URL} webId - WebId of user
 * @returns {Promise<object>} Object - The object containing the information related
 * to the person on their profile card, the profile dataset, and the profile Thing
 */
export const fetchProfileInfo = async (session, webId) => {
  const profileDataset = await getWebIdDataset(webId);
  const profileThing = getThing(profileDataset, webId);

  const profileName = getStringNoLocale(profileThing, RDF_PREDICATES.profileName);
  const nickname = getStringNoLocale(profileThing, RDF_PREDICATES.nickname);
  const profileImage = getUrl(profileThing, RDF_PREDICATES.profileImg);

  let privateProfileDataset;
  let privateProfileThing;
  let dateOfBirth;

  try {
    privateProfileDataset = await getSolidDataset(
      `${webId.split('profile')[0]}PASS/Profile/privateProfile.ttl`,
      { fetch: session.fetch }
    );

    privateProfileThing = getThing(
      privateProfileDataset,
      `${webId.split('profile')[0]}PASS/Profile/privateProfile.ttl#privateProfile`
    );

    dateOfBirth = getDate(privateProfileThing, RDF_PREDICATES.dateOfBirth);
  } catch {
    privateProfileThing = null;
    dateOfBirth = null;
  }

  const profileInfo = { profileName, nickname, profileImage };
  const privateProfileInfo = { dateOfBirth };

  return {
    profileDataset,
    profileThing,
    profileInfo,
    privateProfileDataset,
    privateProfileThing,
    privateProfileInfo
  };
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
 * @param {object} inputValuesPrivate - The inputs for updating private profile
 * information on their private profile information
 * @returns {Promise} Promise - Performs action to update profile card on the
 * user's profile card
 */
export const updateProfileInfo = async (session, profileData, inputValues, inputValuesPrivate) => {
  let { profileDataset, profileThing, privateProfileDataset, privateProfileThing } = profileData;
  const { profileInfo, privateProfileInfo } = profileData;

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

  Object.keys(inputValuesPrivate).forEach((input) => {
    if (input === 'dateOfBirth') {
      switch (inputValuesPrivate[input]) {
        case null:
          privateProfileThing = removeDate(
            privateProfileThing,
            RDF_PREDICATES[input],
            privateProfileInfo[input]
          );
          break;
        default:
          if (inputValuesPrivate[input].$d === undefined) {
            return;
          }
          privateProfileThing = buildThing(privateProfileThing)
            .setDate(RDF_PREDICATES[input], inputValuesPrivate[input].$d)
            .build();
          break;
      }
    }
  });

  profileDataset = setThing(profileDataset, profileThing);
  await saveSolidDatasetAt(session.info.webId, profileDataset, { fetch: session.fetch });

  privateProfileDataset = setThing(privateProfileDataset, privateProfileThing);
  await saveSolidDatasetAt(
    `${session.info.webId.split('profile')[0]}PASS/Profile/privateProfile.ttl`,
    privateProfileDataset,
    { fetch: session.fetch }
  );
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
  const profileImgFilename = inputImage.name.replace(' ', '%20');

  const savedFile = await saveFileInContainer(profileContainer, inputImage, {
    slug: profileImgFilename,
    contentType: inputImage.type,
    fetch: session.fetch
  });

  const savedFilePath = getSourceUrl(savedFile);

  // Saving file path to source URL after saving to cover edge cases with .jpg/.jpeg
  profileThing = saveSourceUrlToThing(profileThing, savedFilePath, 'profileImg');
  profileDataset = setThing(profileDataset, profileThing);

  await saveSolidDatasetAt(session.info.webId, profileDataset, { fetch: session.fetch });

  // Create ACL file for profile image
  const imageResource = await getFile(savedFilePath, { fetch: session.fetch });

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

/**
 * Function that generates the initial private profile TTL file for user if it
 * does not already exist within the user's Pod
 *
 * @function generatePrivateProfileTTL
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {URL} podUrl - Pod URL of user
 * @returns {Promise} Promise - Performs action that generates a new privateProfile.ttl
 * if it does not exist
 */
export const generatePrivateProfileTTL = async (session, podUrl) => {
  const privateProfileUrl = `${podUrl}PASS/Profile/privateProfile.ttl`;

  try {
    await getSolidDataset(privateProfileUrl, { fetch: session.fetch });
  } catch {
    const privateProfileThing = buildThing(createThing({ name: 'privateProfile' }))
      .addUrl(RDF_PREDICATES.url, `${podUrl}PASS/Profile/privateProfile.ttl`)
      .build();

    let newPrivateProvileDataset = createSolidDataset();
    newPrivateProvileDataset = setThing(newPrivateProvileDataset, privateProfileThing);

    await saveSolidDatasetAt(`${podUrl}PASS/Profile/privateProfile.ttl`, newPrivateProvileDataset, {
      fetch: session.fetch
    });
  }
};
