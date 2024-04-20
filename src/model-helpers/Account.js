import {
  buildThing,
  createAcl,
  deleteFile,
  getFile,
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
 * @typedef {import('@inrupt/solid-client-authn-browser').Session} Session
 */

/**
 * A function fetches the user's profile information from their webId's profile
 * card
 *
 * @function fetchAccountInfo
 * @param {URL} webId - WebId of user
 * @returns {Promise<object>} Object - The object containing the information related
 * to the person on their profile card, the profile dataset, and the profile Thing
 */
export const fetchAccountInfo = async (webId) => {
  const accountDataset = await getWebIdDataset(webId);
  const accountThing = getThing(accountDataset, webId);

  const accountName = getStringNoLocale(accountThing, RDF_PREDICATES.accountName);
  const nickname = getStringNoLocale(accountThing, RDF_PREDICATES.nickname);
  const accountImage = getUrl(accountThing, RDF_PREDICATES.accountImg);

  const accountInfo = { accountName, nickname, accountImage };

  return {
    accountDataset,
    accountThing,
    accountInfo
  };
};

/**
 * A function that updates the user's profile information based on what is inputed
 * in the Account page
 *
 * @function updateAccountInfo
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {object} accountData - The object containing the information related
 * to the person on their profile card, the profile dataset, and the profile Thing
 * @param {object} inputValues - The inputs for updating profile information
 * on their profile card
 * @returns {Promise} Promise - Performs action to update profile card on the
 * user's profile card
 */
export const updateAccountInfo = async (session, accountData, inputValues) => {
  let { accountDataset, accountThing } = accountData;
  const { accountInfo } = accountData;

  Object.keys(inputValues).forEach((input) => {
    switch (inputValues[input]) {
      case null:
        return;
      case '':
        accountThing = removeStringNoLocale(
          accountThing,
          RDF_PREDICATES[input],
          accountInfo[input]
        );
        break;
      default:
        accountThing = buildThing(accountThing)
          .setStringNoLocale(RDF_PREDICATES[input], inputValues[input])
          .build();
        break;
    }
  });

  accountDataset = setThing(accountDataset, accountThing);
  await saveSolidDatasetAt(session.info.webId, accountDataset, { fetch: session.fetch });
};

/**
 * Function that upload account image of user onto their profile container and
 * reference it on their Pod
 *
 * @function uploadAccountImage
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {object} accountData - The object containing the information related
 * to the person on their profile card, the profile dataset, and the profile Thing
 * @param {Blob} inputImage - File blob being uploaded for account image
 * @returns {Promise} Promise - Performs a file upload of your account image onto
 * your pod at /account
 */
export const uploadAccountImage = async (session, accountData, inputImage) => {
  let { accountDataset, accountThing } = accountData;

  const profileContainer = `${session.info.webId.split('card')[0]}`;
  const accountImgFilename = inputImage.name.replace(' ', '%20');

  const savedFile = await saveFileInContainer(profileContainer, inputImage, {
    slug: accountImgFilename,
    contentType: inputImage.type,
    fetch: session.fetch
  });

  const savedFilePath = getSourceUrl(savedFile);

  // Saving file path to source URL after saving to cover edge cases with .jpg/.jpeg
  accountThing = saveSourceUrlToThing(accountThing, savedFilePath, 'accountImg');
  accountDataset = setThing(accountDataset, accountThing);

  await saveSolidDatasetAt(session.info.webId, accountDataset, { fetch: session.fetch });

  // Create ACL file for account image
  const imageResource = await getFile(savedFilePath, { fetch: session.fetch });

  const resourceAcl = createAcl(imageResource);
  const newAcl = setupAcl(
    resourceAcl,
    session.info.webId,
    { read: true, write: true, control: true }, // civic access
    { read: true } // public access
  );
  await saveAclFor(imageResource, newAcl, { fetch: session.fetch });
};

/**
 * Function that removes the account image being used on their Pod and removes
 * the field for account image
 *
 * @function removeAccountImage
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {object} accountData - The object containing the information related
 * to the person on their profile card, the profile dataset, and the profile Thing
 * @returns {Promise} Promise - Perform action that removes the account image from
 * the profile card and the account image
 */
export const removeAccountImage = async (session, accountData) => {
  let { accountDataset, accountThing } = accountData;
  const accountImg = getUrl(accountThing, RDF_PREDICATES.accountImg);

  if (accountImg) {
    accountThing = removeUrl(accountThing, RDF_PREDICATES.accountImg, accountImg);

    accountDataset = setThing(accountDataset, accountThing);
    await saveSolidDatasetAt(session.info.webId, accountDataset, { fetch: session.fetch });

    await deleteFile(accountImg, { fetch: session.fetch });
  }
};
