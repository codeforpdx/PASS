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

import { createDocAclForUser } from './session-helper';

import { RDF_PREDICATES } from '../constants';

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
    privateKey: privateExported,
    publicKey: publicExported
  };
};

const createPassUserCredentials = async () => {
  const { privateKey, publicKey } = await generateRsaKeyStrings();

  const privateKeyThing = buildThing(createThing({ name: 'privateKey' }))
    .addStringNoLocale(RDF_PREDICATES.sha256, JSON.stringify(privateKey))
    .build();
  const privateKeyDataSet = setThing(createSolidDataset(), privateKeyThing);

  const publicKeyThing = buildThing(createThing({ name: 'publicKey' }))
    .addStringNoLocale(RDF_PREDICATES.sha256, JSON.stringify(publicKey))
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

  await createDocAclForUser(session, containerUrl, keyAccessAcl);
  await createDocAclForUser(session, privateKeyUrl, keyAccessAcl);
  await createDocAclForUser(session, publicKeyUrl, keyAccessAcl);
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
    } catch {
      await InitializePassUserCredentials(session);
      key = await getUserSigningKeyInternal(session);
    }
  } catch {
    key = null;
  }
  return key;
};

export const serializeDataSet = async (ttlFile) => {
  let serializedTtl = '';
  const mockFetch = async (_url, { body }) => {
    serializedTtl = body;
    return new Response({}, { status: 200 });
  };

  // Inrupt's Solid client doesn't expose a Thing serializer,
  // but it does expose a fetch in the saveSolidDatasetInContainer function
  // that puts the serialized document in the body
  try {
    await saveSolidDatasetInContainer('ignored url', ttlFile, {
      fetch: mockFetch
    });
  } catch {
    return serializedTtl;
  }

  return serializedTtl;
};

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
  // sign() returns an array buffer containing the raw bytes of the hash
  // Convert these bytes into a string using TextDecoder
  // TextDecoder defaults to utf-8
  const signature = new TextDecoder().decode(arrayBuffer);
  return signature;
};

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
