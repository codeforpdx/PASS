import {
  buildThing,
  getSolidDataset,
  getThingAll,
  saveSolidDatasetAt,
  saveSolidDatasetInContainer,
  setThing
} from '@inrupt/solid-client';
import { RDF_PREDICATES } from '../../constants';
import { getUserSigningKey, signDocumentTtlFile } from '../cryptography/credentials-helper';
import { createResourceTtlFile, placeFileInContainer } from './session-helper';

/**
 * @typedef {import("@inrupt/solid-client-authn-browser").Session} Session
 */

/**
 * @typedef {import("../../typedefs").fileObjectType} fileObjectType
 */

/**
 * Function that updates ttl file in Solid container for endDate (expiration
 * date) and description while also including datetime of all instances when
 * document was modified
 *
 * @memberof utils
 * @function updateFile
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {URL} containerUrl - Url link to document container
 * @param {boolean} verifyDocument - True if document submission should include
 * user verification
 * @param {fileObjectType} fileObject - Object containing information about file
 * from form submission (see {@link fileObjectType})
 * @returns {Promise} Promise - Perform an update to an existing document.ttl by
 * setting a new expiration date, description, and date modified
 */

export const updateFile = async (session, containerUrl, verifyDocument, fileObject) => {
  let solidDataset = await getSolidDataset(`${containerUrl}document.ttl`, { fetch: session.fetch });
  const ttlFileThingAll = getThingAll(solidDataset);
  const fileName = fileObject.file.name;
  let ttlFileThing = ttlFileThingAll.find(
    (item) =>
      item.predicates[RDF_PREDICATES.url]?.namedNodes[0] ===
      `${containerUrl}${fileName.replace("'", '').replace(' ', '%20')}`
  );

  ttlFileThing = buildThing(ttlFileThing)
    .setStringNoLocale(RDF_PREDICATES.endDate, fileObject.date)
    .setStringNoLocale(RDF_PREDICATES.description, fileObject.description)
    .setDatetime(RDF_PREDICATES.dateModified, new Date())
    .build();
  solidDataset = setThing(solidDataset, ttlFileThing);

  // TODO: would need to think about how to implement new signature.ttl if file is updated
  // since old signature.ttl will no longer be valid
  await saveSolidDatasetAt(`${containerUrl}document.ttl`, solidDataset, { fetch: session.fetch });

  const signingKey = verifyDocument ? await getUserSigningKey(session) : null;
  const signatureDataset = signingKey
    ? await signDocumentTtlFile(signingKey, solidDataset, session, containerUrl)
    : null;

  if (signatureDataset) {
    await saveSolidDatasetInContainer(containerUrl, signatureDataset, {
      slugSuggestion: 'signature.ttl',
      contentType: 'text/turtle',
      fetch: session.fetch
    });
  }
};

/**
 * Function that uploads a new file to Pod and appends ttl file in Solid container
 * for endDate (expiration date) and description
 *
 * @memberof utils
 * @function uploadNewFile
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {URL} containerUrl - Url link to document container
 * @param {boolean} verifyDocument - True if document submission should include
 * user verification
 * @param {fileObjectType} fileObject - Object containing information about file
 * from form submission (see {@link fileObjectType})
 * @returns {Promise} Promise - Perform an update to an existing document.ttl by
 * setting a new expiration date, description, and date modified
 */

export const uploadNewFile = async (session, containerUrl, verifyDocument, fileObject) => {
  await placeFileInContainer(session, fileObject, containerUrl);

  let solidDataset = await getSolidDataset(`${containerUrl}document.ttl`, { fetch: session.fetch });
  const ttlFileLength = getThingAll(solidDataset).length;

  const fileName = fileObject.file.name;
  const newTTLFileThing = await createResourceTtlFile(
    fileObject,
    `${containerUrl}${fileName.replace("'", '').replace(' ', '%20')}`,
    `document${ttlFileLength - 1}` // will need a better way to make unique name after initial document upload
  );

  solidDataset = setThing(solidDataset, newTTLFileThing);

  await saveSolidDatasetAt(`${containerUrl}document.ttl`, solidDataset, { fetch: session.fetch });

  const signingKey = verifyDocument ? await getUserSigningKey(session) : null;
  const signatureDataset = signingKey
    ? await signDocumentTtlFile(signingKey, solidDataset, session, containerUrl)
    : null;

  if (signatureDataset) {
    await saveSolidDatasetInContainer(containerUrl, signatureDataset, {
      slugSuggestion: 'signature.ttl',
      contentType: 'text/turtle',
      fetch: session.fetch
    });
  }
};
