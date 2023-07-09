import {
  buildThing,
  createAcl,
  createContainerAt,
  createSolidDataset,
  createThing,
  deleteFile,
  getFile,
  getSolidDataset,
  getSourceUrl,
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
import { saveSourceUrlToThing, setupAcl } from '../utils';

/**
 * @typedef {import('@inrupt/solid-ui-react').SessionContext} Session
 */

/**
 * @typedef {import('@inrupt/solid-client').Thing} Thing
 */

/**
 * @typedef {import('@inrupt/solid-client').SolidDataset} SolidDataset
 */

/**
 * Function that generates the settings container to store the Preference File
 * Document and the Type Index Documents for the profile if settings are missing
 *
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {URL} podUrl - Pod URL of user
 * @returns {Promise} Promise - Generate the settings container in Solid Pod if
 * the settings container are missing from the Pod
 */
export const createSettingsContainer = async (session, podUrl) => {
  const settingsContainerUrl = `${podUrl}settings/`;

  try {
    await getSolidDataset(settingsContainerUrl, { fetch: session.fetch });
  } catch {
    await createContainerAt(settingsContainerUrl, { fetch: session.fetch });

    // Generate Public Type Index Documents
    const newPublicTypeIndexThing = buildThing(createThing({ name: 'public_Type_Index' }))
      .addUrl(RDF_PREDICATES.type, RDF_PREDICATES.typeIndex)
      .addUrl(RDF_PREDICATES.type, RDF_PREDICATES.listedDocument)
      .build();

    let newPublicTypeIndexDataset = createSolidDataset();
    newPublicTypeIndexDataset = setThing(newPublicTypeIndexDataset, newPublicTypeIndexThing);

    await saveSolidDatasetAt(
      `${settingsContainerUrl}publicTypeIndex.ttl`,
      newPublicTypeIndexDataset,
      { slug: 'publicTypeIndex.ttl', fetch: session.fetch }
    );

    // Generate Private Type Index Documents
    const newPrivateTypeIndexThing = buildThing(createThing({ name: 'private_Type_Index' }))
      .addUrl(RDF_PREDICATES.type, RDF_PREDICATES.typeIndex)
      .addUrl(RDF_PREDICATES.type, RDF_PREDICATES.unlistedDocument)
      .build();

    let newPrivateTypeIndexDataset = createSolidDataset();
    newPrivateTypeIndexDataset = setThing(newPrivateTypeIndexDataset, newPrivateTypeIndexThing);

    await saveSolidDatasetAt(
      `${settingsContainerUrl}privateTypeIndex.ttl`,
      newPrivateTypeIndexDataset,
      { slug: 'privateTypeIndex.ttl', fetch: session.fetch }
    );

    // Generate Preference File Document
    const newPreferenceFileThing = buildThing(createThing({ name: 'preferences_file' }))
      .addUrl(RDF_PREDICATES.type, RDF_PREDICATES.preferenceFile)
      .addStringNoLocale(RDF_PREDICATES.title, 'Preferences file')
      .build();

    const newPreferenceFileDocumentsThing = buildThing(createThing({ name: 'type_index_files' }))
      .addUrl(RDF_PREDICATES.publicTypeIndex, `${settingsContainerUrl}publicTypeIndex.ttl`)
      .addUrl(RDF_PREDICATES.privateTypeIndex, `${settingsContainerUrl}privateTypeIndex.ttl`)
      .build();

    let newPreferenceFileDataset = createSolidDataset();
    newPreferenceFileDataset = setThing(newPreferenceFileDataset, newPreferenceFileThing);
    newPreferenceFileDataset = setThing(newPreferenceFileDataset, newPreferenceFileDocumentsThing);

    await saveSolidDatasetAt(`${settingsContainerUrl}prefs.ttl`, newPreferenceFileDataset, {
      slug: 'prefs.ttl',
      fetch: session.fetch
    });
  }
};

/**
 * Function that initializes Solid Profile to the v1 specification of the Solid
 * WebID Profile: https://solid.github.io/webid-profile/
 *
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {URL} podUrl - Pod URL of user
 * @returns {Promise} Promise - Initializes Solid Profile to v1 specifications
 * in case there are fields missing in the profile
 */
export const initializeSolidProfile = async (session, podUrl) => {
  let profileDataset = await getWebIdDataset(session.info.webId);
  let profileThing = getThing(profileDataset, session.info.webId);

  const preferenceFile = getUrl(profileThing, RDF_PREDICATES.preferenceFile);
  if (!preferenceFile) {
    profileThing = buildThing(profileThing)
      .addUrl(RDF_PREDICATES.preferenceFile, `${podUrl}settings/prefs.ttl`)
      .build();
    profileDataset = setThing(profileDataset, profileThing);
  }

  const publicTypeIndex = getUrl(profileThing, RDF_PREDICATES.publicTypeIndex);
  if (!publicTypeIndex) {
    profileThing = buildThing(profileThing)
      .addUrl(RDF_PREDICATES.publicTypeIndex, `${podUrl}settings/publicTypeIndex.ttl`)
      .build();
    profileDataset = setThing(profileDataset, profileThing);
  }

  const privateTypeIndex = getUrl(profileThing, RDF_PREDICATES.privateTypeIndex);
  if (!privateTypeIndex) {
    profileThing = buildThing(profileThing)
      .addUrl(RDF_PREDICATES.privateTypeIndex, `${podUrl}settings/privateTypeIndex.ttl`)
      .build();
    profileDataset = setThing(profileDataset, profileThing);
  }

  const storage = getUrl(profileThing, RDF_PREDICATES.storage);
  if (!storage) {
    profileThing = buildThing(profileThing).addUrl(RDF_PREDICATES.storage, podUrl).build();
    profileDataset = setThing(profileDataset, profileThing);
  }

  const inbox = getUrl(profileThing, RDF_PREDICATES.inbox);
  if (!inbox) {
    profileThing = buildThing(profileThing)
      .addUrl(RDF_PREDICATES.inbox, `${podUrl}PASS/Inbox/`)
      .build();
    profileDataset = setThing(profileDataset, profileThing);
  }

  await saveSolidDatasetAt(session.info.webId, profileDataset, { fetch: session.fetch });
};

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
