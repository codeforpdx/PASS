import {
  getSolidDataset,
  getThing,
  createSolidDataset,
  buildThing,
  createThing,
  saveSolidDatasetAt,
  setThing,
  universalAccess
} from '@inrupt/solid-client';

import { RDF_PREDICATES } from '../constants';

const generateRsaKeyStrings = async () => {
  const { privateKey, publicKey } = await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['encrypt', 'decrypt']
  );

  const privateExported = await window.crypto.subtle.exportKey('jwk', privateKey);
  const publicExported = await window.crypto.subtle.exportKey('jwk', publicKey);

  return {
    privateKey: privateExported,
    publicKey: publicExported
  };
};

const createPassUserCredentials = async () => {
  const { privateKey, publicKey } = await generateRsaKeyStrings();

  const privateKeyThing = buildThing(createThing({ name: 'privateKey' }))
    .addStringNoLocale(RDF_PREDICATES.identifier, JSON.stringify(privateKey))
    .build();
  const privateKeyDataSet = setThing(createSolidDataset(), privateKeyThing);

  const publicKeyThing = buildThing(createThing({ name: 'publicKey' }))
    .addStringNoLocale(RDF_PREDICATES.identifier, JSON.stringify(publicKey))
    .build();
  const publicKeyDataSet = setThing(createSolidDataset(), publicKeyThing);

  return {
    private: privateKeyDataSet,
    public: publicKeyDataSet
  };
};

const savePassUserCredentials = async (dataSets, session) => {
  const privateKeyDataSet = dataSets.private;
  const publicKeyDataSet = dataSets.public;
  const privateKeyUrl = `${String(
    session.info.webId.split('profile')[0]
  )}/PASS_Credentials/private_key.ttl`;
  const publicKeyUrl = `${String(
    session.info.webId.split('profile')[0]
  )}/PASS_Credentials/public_key.ttl`;

  await saveSolidDatasetAt(privateKeyUrl, privateKeyDataSet, {
    fetch: session.fetch
  });
  await saveSolidDatasetAt(publicKeyUrl, publicKeyDataSet, {
    fetch: session.fetch
  });

  const privateKeyPublicAccess = {
    read: false,
    write: false,
    append: false
  };
  const publicKeyPublicAccess = {
    read: true,
    write: false,
    append: false
  };

  await universalAccess.setPublicAccess(privateKeyUrl, privateKeyPublicAccess);
  await universalAccess.setPublicAccess(publicKeyUrl, publicKeyPublicAccess);
};

const getUserSigningKeyInternal = async (session) => {
  const privateKeyUrl = `${String(
    session.info.webId.split('profile')[0]
  )}/PASS_Credentials/private_key.ttl`;
  const dataSet = await getSolidDataset(privateKeyUrl, { fetch: session.fetch });
  return getThing(dataSet, `${privateKeyUrl}#key`);
};

const InitializePassUserCredentials = async (session) => {
  const dataSets = await createPassUserCredentials(session);
  return savePassUserCredentials(dataSets, session);
};

/**
 * Fetches user signing key from user's pod. If one does not exist, creates one, then fetches it.
 *
 * @memberof utils
 * @function getUserSigningKey
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @returns {Promise} Promise - File upload is handled via Solid libraries
 */
const getUserSigningKey = async (session) => {
  let key = null;
  try {
    try {
      key = await getUserSigningKeyInternal(session);
    } catch (e) {
      await InitializePassUserCredentials(session);
      key = await getUserSigningKeyInternal(session);
    }
  } catch {
    return key;
  }
  return key;
};

export default getUserSigningKey;
