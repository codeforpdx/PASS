import {
  getSolidDataset,
  getThing,
  createSolidDataset,
  buildThing,
  createThing,
  saveSolidDatasetAt,
  saveSolidDatasetInContainer,
  setThing,
  getStringNoLocale
} from '@inrupt/solid-client';
import { setDocAclForUser } from '../network/session-helper';
import { RDF_PREDICATES } from '../../constants';

/**
 * @typedef {import('@inrupt/solid-ui-react').SessionContext} Session
 */

const generateRsaKeyStrings = async () => {
  const { privateKey, publicKey } = await window.crypto.subtle.generateKey(
    {
      name: 'RSA-PSS',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['sign', 'verify']
  );

  const privateExported = await window.crypto.subtle.exportKey('jwk', privateKey);
  const publicExported = await window.crypto.subtle.exportKey('jwk', publicKey);

  return {
    privateKey: JSON.stringify(privateExported),
    publicKey: JSON.stringify(publicExported)
  };
};

const createPassUserCredentials = async () => {
  const { privateKey, publicKey } = await generateRsaKeyStrings();

  const privateKeyThing = buildThing(createThing({ name: 'privateKey' }))
    .addStringNoLocale(RDF_PREDICATES.sha256, privateKey)
    .build();
  const privateKeyDataSet = setThing(createSolidDataset(), privateKeyThing);

  const publicKeyThing = buildThing(createThing({ name: 'publicKey' }))
    .addStringNoLocale(RDF_PREDICATES.sha256, publicKey)
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
  const containerUrl = `${String(session.info.webId.split('profile')[0])}PASS_Credentials/`;
  const privateKeyUrl = `${String(
    session.info.webId.split('profile')[0]
  )}PASS_Credentials/private_key.ttl`;
  const publicKeyUrl = `${String(
    session.info.webId.split('profile')[0]
  )}PASS_Credentials/public_key.ttl`;

  await saveSolidDatasetAt(privateKeyUrl, privateKeyDataSet, {
    fetch: session.fetch
  });
  await saveSolidDatasetAt(publicKeyUrl, publicKeyDataSet, {
    fetch: session.fetch
  });

  const keyAccessAcl = {
    read: true,
    write: false,
    append: false,
    control: true
  };

  await setDocAclForUser(session, containerUrl, 'create', session.info.webId, keyAccessAcl);
  await setDocAclForUser(session, privateKeyUrl, 'create', session.info.webId, keyAccessAcl);
  await setDocAclForUser(session, publicKeyUrl, 'create', session.info.webId, keyAccessAcl);
};

const getUserSigningKeyInternal = async (session) => {
  const privateKeyUrl = `${String(
    session.info.webId.split('profile')[0]
  )}PASS_Credentials/private_key.ttl`;
  const dataSet = await getSolidDataset(privateKeyUrl, { fetch: session.fetch });
  const keyString = getStringNoLocale(
    getThing(dataSet, `${privateKeyUrl}#privateKey`),
    RDF_PREDICATES.sha256
  );
  const key = await window.crypto.subtle.importKey(
    'jwk',
    JSON.parse(keyString),
    {
      name: 'RSA-PSS',
      hash: 'SHA-256'
    },
    false,
    ['sign']
  );
  return key;
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
export const getUserSigningKey = async (session) => {
  let key = null;
  try {
    try {
      key = await getUserSigningKeyInternal(session);
    } catch (e) {
      await InitializePassUserCredentials(session);
      key = await getUserSigningKeyInternal(session);
    }
  } catch (e) {
    key = null;
  }
  return key;
};

/**
 * Serializes a given Solid DataSet into TTL
 * Note: Should not be used for networking. Use inrupt's libraries for that
 *
 * @memberof utils
 * @function serializeDataSet
 * @param {import('@inrupt/solid-client').SolidDataset} dataSet - Inrupt Dataset you want to serialize
 * @returns {Promise} Promise that resolves to dataset serialized into a ttl string
 */
export const serializeDataSet = async (dataSet) => {
  let serializedTtl = '';
  const mockFetch = async (_url, { body }) => {
    serializedTtl = body;
    return new Response({}, { status: 200 });
  };

  // Inrupt's Solid client doesn't expose a Thing serializer,
  // but it does expose a fetch in the saveSolidDatasetInContainer function
  // that puts the serialized document in the body
  try {
    await saveSolidDatasetInContainer('ignored url', dataSet, {
      fetch: mockFetch
    });
  } catch {
    return serializedTtl;
  }

  return serializedTtl;
};

/**
 * Generates a cryptographic signature for a given document
 *
 * @memberof utils
 * @function generateRsaSignature
 * @param {CryptoKey} key - The RSA-PSS private key to sign the document with
 * @param {string} data - The data to generate the signature for
 * @returns {Promise} Promise that resolves to a string containing a Base64 encoding of the signature
 */
export const generateRsaSignature = async (key, data) => {
  const messageData = new TextEncoder().encode(data);
  const arrayBuffer = await window.crypto.subtle.sign(
    {
      name: 'RSA-PSS',
      saltLength: 32
    },
    key,
    messageData
  );
  // sign() returns an ArrayBuffer containing the raw bytes of the hash
  // We need to convert these bytes into a string for serialization
  return window.btoa(String.fromCharCode.apply(null, [...new Uint8Array(arrayBuffer)]));
};

/**
 * Generates a DataSet containing a signature for a given RDF document
 *
 * @memberof utils
 * @function signDocumentTtlFile
 * @param {CryptoKey} signingKey - The RSA-PSS private key to sign the document with
 * @param {string} dataSet - The data to generate the signature for
 * @param {Session} session - the current session to use
 * @param {string} dataSetUrl - the Url for the dataset you generated the signature for
 * @returns {Promise} - resolves to a Solid Dataset containing the signature document
 */
export const signDocumentTtlFile = async (signingKey, dataSet, session, dataSetUrl) => {
  const serializedTtl = await serializeDataSet(dataSet);

  const signature = await generateRsaSignature(signingKey, serializedTtl);
  const verifier = session.info.webId;

  const signatureThing = buildThing(createThing({ name: 'signature' }))
    .addStringNoLocale(RDF_PREDICATES.sha256, signature)
    .addUrl(RDF_PREDICATES.accountablePerson, verifier)
    .addUrl(RDF_PREDICATES.url, dataSetUrl)
    .build();

  const newSolidDataset = createSolidDataset();
  return setThing(newSolidDataset, signatureThing);
};

/**
 * Validates if the signature is associated with the document and agent
 *
 * @memberof utils
 * @function validateSignature
 * @param {CryptoKey} publicKey - The RSA-PSS public key for the signatory
 * @param {string} signature - The Base64 encoded signature string
 * @param {string} document - the document the signature is for
 * @returns {Promise} - resolves to true if the (key, signature, document) tuple is valid. False otherwise
 */
export const validateSignature = async (publicKey, signature, document) => {
  // Convert signature from base64 string to arrayBuffer
  const decodeSignature = (base64String) =>
    Uint8Array.from(window.atob(base64String), (c) => c.charCodeAt(0));

  const result = await window.crypto.subtle.verify(
    {
      name: 'RSA-PSS',
      saltLength: 32
    },
    publicKey,
    decodeSignature(signature),
    new TextEncoder().encode(document)
  );
  return result;
};
