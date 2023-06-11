import {
  getSolidDataset,
  createThing,
  buildThing,
  setThing,
  getThingAll,
  createSolidDataset,
  getStringNoLocale,
  getUrl,
  saveSolidDatasetAt,
  saveFileInContainer,
  getContainedResourceUrlAll,
  deleteFile,
  deleteSolidDataset
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
 * Function that fetch the URL of the container containing a specific file
 * uploaded to a user's Pod on Solid, if exist
 *
 * @memberof utils
 * @function getDocuments
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {string} fileType - Type of document
 * @param {string} podUrl - Url to other user's Pod (set to empty string
 * by default)
 * @returns {Promise<URL>} Promise - Either a string containing the url location of
 * the document, if exist, or throws an Error
 */
export const getDocuments = async (session, fileType, podUrl) => {
  const documentUrl = `${podUrl}${fileType}`;

  try {
    await getSolidDataset(documentUrl, { fetch: session.fetch });

    return documentUrl;
  } catch (error) {
    throw new Error('No data found');
  }
};

/**
 * Helper Function that returns Driver's License ttl file based off of image passed
 *
 * @function createDriversLicenseTtlFile
 * @memberof utils
 * @function createDriversLicenseTtlFile
 * @param {fileObjectType} fileObject - Object containing information about file
 * @returns {Promise<ThingLocal>} TTL file Thing - Processes a barcode using zxing
 * and returns a new TTL file Thing
 */
const createDriversLicenseTtlFile = async (fileObject) => {
  const dlData = await getDriversLicenseData(fileObject.file);
  return buildThing(createThing({ name: 'license information' }))
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
    .addStringNoLocale(RDF_PREDICATES.additionalName, dlData.DDG)
    .build();
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

const addAdditionalInfo = (thing, fileObject) => {
  if (fileObject.type === "Driver's License") {
    return thing.addUrl(RDF_PREDICATES.about, createDriversLicenseTtlFile(fileObject));
  }
  return thing;
};

export const serializeDocument = async (fileObject, documentUrl, file) => {
  const checksum = await createFileChecksum(file);

  let thing = buildThing(createThing({ name: fileObject.name }))
    .addDatetime(RDF_PREDICATES.uploadDate, new Date())
    .addStringNoLocale(RDF_PREDICATES.name, fileObject.name)
    .addStringNoLocale(RDF_PREDICATES.identifier, fileObject.type)
    .addStringNoLocale(RDF_PREDICATES.endDate, fileObject.date)
    .addStringNoLocale(RDF_PREDICATES.sha256, checksum)
    .addStringNoLocale(RDF_PREDICATES.description, fileObject.description)
    .addUrl(RDF_PREDICATES.url, documentUrl);

  thing = addAdditionalInfo(thing, fileObject);
  return thing.build();
};

export const parseDocument = (documentThing) => {
  const uploadDate = getStringNoLocale(documentThing, RDF_PREDICATES.uploadDate);
  const name = getStringNoLocale(documentThing, RDF_PREDICATES.name);
  const type = getStringNoLocale(documentThing, RDF_PREDICATES.identifier);
  const endDate = getStringNoLocale(documentThing, RDF_PREDICATES.endDate);
  const checksum = getStringNoLocale(documentThing, RDF_PREDICATES.sha256);
  const description = getStringNoLocale(documentThing, RDF_PREDICATES.description);
  const fileUrl = getUrl(documentThing, RDF_PREDICATES.URL);
  return { uploadDate, name, type, endDate, checksum, description, fileUrl };
};

const deleteRecursively = async (dataset, options) => {
  const containedResourceUrls = getContainedResourceUrlAll(dataset);
  const containedDatasets = await Promise.all(
    containedResourceUrls.map(async (resourceUrl) => {
      try {
        return await getSolidDataset(resourceUrl, options);
      } catch (e) {
        // The Resource might not have been a SolidDataset;
        // we can delete it directly:
        await deleteFile(resourceUrl, options);
        return null;
      }
    })
  );
  await Promise.all(
    containedDatasets.map(async (containedDataset) => {
      if (containedDataset === null) {
        return;
      }
      await deleteRecursively(containedDataset, options);
    })
  );
  await deleteSolidDataset(dataset, options);
};

export const saveDocument = async (docThing, dataset, session, docUrl) => {
  const newDataset = setThing(dataset, docThing);
  const name = getStringNoLocale(docThing, RDF_PREDICATES.name);
  const doc = await saveSolidDatasetAt(`${docUrl}${name}.ttl`, newDataset, {
    fetch: session.fetch
  });
  return doc;
};

export const createDocument = async (file, fileDescription, session, passUrl) => {
  const { type, name } = fileDescription;
  const docUrl = `${passUrl}Documents/${type}/${name}/`;
  try {
    await getSolidDataset(docUrl);
  } catch {
    const docThing = await serializeDocument(fileDescription, docUrl, file);
    const doc = await saveDocument(docThing, createSolidDataset(), session, docUrl);
    await saveFileInContainer(docUrl, file, {
      fetch: session.fetch,
      slugSuggestion: file.name
    });
    return parseDocument(getThingAll(doc)[0]);
  }
  return 'A file with this name already exists';
};

// export const fetchDocument = (filename, session, podUrl) => {}
export const deleteDocument = async (session, docUrl) => {
  const options = {
    fetch: session.fetch
  };
  const container = await getSolidDataset(docUrl, options);
  await deleteRecursively(container, options);
};
