import { createThing, buildThing, getStringNoLocale, getUrl, getDate } from '@inrupt/solid-client';

import dayjs from 'dayjs';

import { RDF_PREDICATES } from '../constants';
import { getDriversLicenseData, formattedDate } from '../utils';

/**
 * @typedef {import('@inrupt/solid-client-authn-browser').Session} Session
 */

/**
 * @typedef {import('../../typedefs').fileObjectType} fileObjectType
 */

/**
 * @typedef {import('@inrupt/solid-client').ThingLocal} ThingLocal
 */

/**
 * Helper Function that returns Driver's License ttl file based off of image passed
 *
 * @memberof utils
 * @function addDriversLicenseInfo
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
      .addDate(RDF_PREDICATES.expires, dayjs(`${formattedDate(dlData.DBA)}`).$d)
      .addStringNoLocale(RDF_PREDICATES.givenName, dlData.DCS)
      .addStringNoLocale(RDF_PREDICATES.alternateName, dlData.DAC)
      .addStringNoLocale(RDF_PREDICATES.familyName, dlData.DAD)
      .addDate(RDF_PREDICATES.dateIssued, dayjs(`${formattedDate(dlData.DBD)}`).$d)
      .addDate(RDF_PREDICATES.dateOfBirth, dayjs(`${formattedDate(dlData.DBB)}`).$d)
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
 * returns additional info about a specific type
 *
 * @function addAdditionalInfo
 * @memberof Document
 * @param {object} docDesc - the doc
 * @param {ThingLocal} thing - a thing
 * @param {fileObjectType} file - file blob
 * @returns {Promise<ThingLocal>} a thing
 */
const addAdditionalInfo = async (docDesc, thing, file) => {
  if (docDesc.type === 'driversLicense') {
    const retThing = await addDriversLicenseInfo(thing, file);
    return retThing;
  }
  return thing;
};

/**
 * returns additional info about a specific type
 *
 * @function makeDocIntoThing
 * @memberof Document
 * @param {object} docDesc - the doc
 * @param {fileObjectType} file - file blob
 * @returns {Promise<ThingLocal>} a thing
 */
export const makeDocIntoThing = async (docDesc, file) => {
  let thing = buildThing(createThing({ name: docDesc.name }))
    .addDate(RDF_PREDICATES.uploadDate, dayjs().$d)
    .addStringNoLocale(RDF_PREDICATES.name, docDesc.name)
    .addStringNoLocale(RDF_PREDICATES.identifier, docDesc.type)
    .addStringNoLocale(RDF_PREDICATES.additionalType, docDesc.type)
    .addStringNoLocale(RDF_PREDICATES.description, docDesc.description);

  if (docDesc.date) thing.addDate(RDF_PREDICATES.endDate, dayjs(docDesc.date).$d);
  thing = await addAdditionalInfo(docDesc, thing, file);
  return thing.build();
};

/**
 * returns additional info about a specific type
 *
 * @function parseDocFromThing
 * @memberof Document
 * @param {ThingLocal} documentThing - the thing
 * @returns {object} the document
 */
export const parseDocFromThing = (documentThing) => {
  const uploadDate = getDate(documentThing, RDF_PREDICATES.uploadDate);
  const name = getStringNoLocale(documentThing, RDF_PREDICATES.name);
  const type = getStringNoLocale(documentThing, RDF_PREDICATES.identifier);
  const endDate = getDate(documentThing, RDF_PREDICATES.endDate);
  const description = getStringNoLocale(documentThing, RDF_PREDICATES.description);
  const fileUrl = getUrl(documentThing, RDF_PREDICATES.url);
  return { uploadDate, name, type, endDate, description, fileUrl };
};
