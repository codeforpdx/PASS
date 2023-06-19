import {
  createThing,
  buildThing,
  getStringNoLocale,
  getUrl,
  saveSolidDatasetAt,
  getDate
} from '@inrupt/solid-client';

import sha256 from 'crypto-js/sha256';

import getDriversLicenseData from '../utils/barcode/barcode-scan';
import formattedDate from '../utils/barcode/barcode-date-parser';
import { RDF_PREDICATES } from '../constants';
import { getUserSigningKey, signDocumentTtlFile } from '../utils/cryptography/credentials-helper';

/**
 * @typedef {import('@inrupt/solid-ui-react').SessionContext} Session
 */

/**
 * @typedef {import('../../typedefs').fileObjectType} fileObjectType
 */

/**
 * @typedef {import('@inrupt/solid-client').ThingLocal} ThingLocal
 */

/**
 * @typedef {import('crypto-js').CryptoJS.lib.WordArray} WordArray
 */

export const signDocument = async (document, session, containerUrl) => {
  const signingKey = await getUserSigningKey(session);
  const signatureDataset = await signDocumentTtlFile(signingKey, document, session, containerUrl);
  await saveSolidDatasetAt(`${containerUrl}signature.ttl`, signatureDataset, {
    fetch: session.fetch
  });
};

/**
 * Helper Function that returns Driver's License ttl file based off of image passed
 *
 * @function createDriversLicenseTtlFile
 * @memberof utils
 * @function createDriversLicenseTtlFile
 * @param {thing} thing - the thing to add info too
 * @param {fileObjectType} file - Object containing information about file
 * @returns {Promise<ThingLocal>} TTL file Thing - Processes a barcode using zxing
 * and returns a new TTL file Thing
 */
const addDriversLicenseInfo = async (thing, file) => {
  try {
    const dlData = await getDriversLicenseData(file);
    return thing
      .addStringNoLocale(RDF_PREDICATES.additionalType, dlData.DCA)
      .addStringNoLocale(RDF_PREDICATES.conditionsOfAccess, dlData.DCB)
      .addDate(RDF_PREDICATES.expires, new Date(`${formattedDate(dlData.DBA)}`))
      .addStringNoLocale(RDF_PREDICATES.givenName, dlData.DCS)
      .addStringNoLocale(RDF_PREDICATES.alternateName, dlData.DAC)
      .addStringNoLocale(RDF_PREDICATES.familyName, dlData.DAD)
      .addDate(RDF_PREDICATES.dateIssued, new Date(`${formattedDate(dlData.DBD)}`))
      .addDate(RDF_PREDICATES.dateOfBirth, new Date(`${formattedDate(dlData.DBB)}`))
      .addStringNoLocale(RDF_PREDICATES.gender, dlData.DBC)
      .addStringNoLocale(RDF_PREDICATES.Eye, dlData.DAY)
      .addInteger(RDF_PREDICATES.height, Number(dlData.DAU))
      .addStringNoLocale(RDF_PREDICATES.streetAddress, dlData.DAG)
      .addStringNoLocale(RDF_PREDICATES.City, dlData.DAI)
      .addStringNoLocale(RDF_PREDICATES.State, dlData.DAJ)
      .addStringNoLocale(RDF_PREDICATES.postalCode, dlData.DAK)
      .addStringNoLocale(RDF_PREDICATES.identifier, dlData.DAQ)
      .addStringNoLocale(RDF_PREDICATES.identifier, dlData.DCF)
      .addStringNoLocale(RDF_PREDICATES.Country, dlData.DCG)
      .addStringNoLocale(RDF_PREDICATES.additionalName, dlData.DDE)
      .addStringNoLocale(RDF_PREDICATES.additionalName, dlData.DDF)
      .addStringNoLocale(RDF_PREDICATES.additionalName, dlData.DDG);
  } catch (e) {
    return thing;
  }
};

/**
 * Function that generates checksum for uploaded file
 *
 * @memberof utils
 * @function createFileChecksum
 * @param {fileObjectType} file - Object containing information about file
 * from form submission (see {@link fileObjectType})
 * @returns {Promise<WordArray>} Promise - Generates checksum for uploaded file
 * using the SHA256 algorithm
 */
const createFileChecksum = async (file) => {
  const text = await file.text(); // only hash the first megabyte
  return sha256(text);
};

const addAdditionalInfo = async (docDesc, thing, file) => {
  if (docDesc.type === 'DriversLicense') {
    const retThing = await addDriversLicenseInfo(thing, file);
    return retThing;
  }
  return thing;
};

export const makeDocIntoThing = async (docDesc, documentUrl, file) => {
  const checksum = await createFileChecksum(file);
  const cleanedFileName = file.name.replaceAll(' ', '%20');
  let thing = buildThing(createThing({ name: docDesc.name }))
    .addDate(RDF_PREDICATES.uploadDate, new Date())
    .addStringNoLocale(RDF_PREDICATES.name, docDesc.name)
    .addStringNoLocale(RDF_PREDICATES.identifier, docDesc.type)
    .addStringNoLocale(RDF_PREDICATES.additionalType, docDesc.type)
    .addStringNoLocale(RDF_PREDICATES.sha256, checksum)
    .addStringNoLocale(RDF_PREDICATES.description, docDesc.description)
    .addUrl(RDF_PREDICATES.url, `${documentUrl}${cleanedFileName}`);

  if (docDesc.date) thing.addDate(RDF_PREDICATES.endDate, new Date(docDesc.date));
  thing = await addAdditionalInfo(docDesc, thing, file);
  return thing.build();
};

export const parseDocFromThing = (documentThing) => {
  const uploadDate = getDate(documentThing, RDF_PREDICATES.uploadDate);
  const name = getStringNoLocale(documentThing, RDF_PREDICATES.name);
  const type = getStringNoLocale(documentThing, RDF_PREDICATES.identifier);
  const endDate = getDate(documentThing, RDF_PREDICATES.endDate);
  const checksum = getStringNoLocale(documentThing, RDF_PREDICATES.sha256);
  const description = getStringNoLocale(documentThing, RDF_PREDICATES.description);
  const fileUrl = getUrl(documentThing, RDF_PREDICATES.url);
  return { uploadDate, name, type, endDate, checksum, description, fileUrl };
};