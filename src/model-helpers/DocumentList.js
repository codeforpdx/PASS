import {
  getSolidDataset,
  setThing,
  getThingAll,
  saveSolidDatasetAt,
  createSolidDataset,
  saveFileInContainer,
  getThing,
  removeThing,
  deleteFile,
  getSourceUrl
} from '@inrupt/solid-client';

import { makeDocIntoThing, parseDocFromThing } from './Document';
import { saveSourceUrlToThing } from '../utils';

/**
 * @typedef {import('@inrupt/solid-ui-react').SessionContext} Session
 */

/**
 * @typedef {import("../typedefs").userListObject} userListObject
 */

/**
 * @typedef {import("@inrupt/solid-client").SolidDataset} SolidDataset
 */

/**
 * Converts a docList dataset into an array of documents.
 *
 * @memberof DocumentList
 * @function parseFromDataset
 * @param {SolidDataset} docsDataset - dataset to convert to array
 * @returns {object} An new docList containing any updates
 */
const parseFromDataset = (docsDataset) => {
  const docList = [];
  const allDocThings = getThingAll(docsDataset);
  allDocThings.forEach((userThing) => {
    const docObject = parseDocFromThing(userThing);
    docList.push(docObject);
  });

  return docList;
};

/**
 * Saves a document list to the user's pod
 *
 * @memberof DocumentList
 * @function saveToPod
 * @param {Session} session - session to use for saving
 * @param {object} docListObject - object containing docList info
 * @param {SolidDataset} docListObject.dataset - dataset to save
 * @param {URL} docListObject.containerUrl - Url of container to save docs to
 * @returns {object} An new docListObject containing any updates
 */
const saveToPod = async (session, { dataset, containerUrl }) => {
  const newDataset = await saveSolidDatasetAt(`${containerUrl}doclist.ttl`, dataset, {
    fetch: session.fetch
  });
  const newList = parseFromDataset(newDataset);
  return { dataset: newDataset, docList: newList, containerUrl };
};

/**
 * Adds a new doc to the document list and saves the list to the pod
 *
 * @memberof DocumentList
 * @function addDocument
 * @param {object} docDesc - Document to add to list
 * @param {object} file - file associated with the document to upload
 * @param {object} docListObject - object containing docList, dataset, and containerUrl
 * @param {SolidDataset} docListObject.dataset - dataset to save
 * @param {URL} docListObject.containerUrl - Url of dataset to save to
 * @param {Array} docListObject.docList - array of Documents
 * @param {Session} session - session
 * @returns {object} An new docListObject containing any updates
 */
export const addDocument = async (docDesc, file, { docList, dataset, containerUrl }, session) => {
  if (docList.find((oldDoc) => oldDoc.name === docDesc.name))
    throw new Error('File already exists');
  let docThing = await makeDocIntoThing(docDesc, file);
  const newDocDesc = parseDocFromThing(docThing);
  const newDocObject = {
    docList: docList.concat([newDocDesc]),
    dataset: setThing(dataset, docThing),
    containerUrl
  };

  const savedFile = await saveFileInContainer(`${containerUrl}`, file, {
    fetch: session.fetch,
    slug: file.name.replaceAll(' ', '%20')
  });

  // Saving file path to source URL after saving to cover edge cases with .jpg/.jpeg
  const savedFilePath = getSourceUrl(savedFile);
  docThing = saveSourceUrlToThing(docThing, savedFilePath, 'url');
  newDocObject.dataset = setThing(dataset, docThing);

  const newObj = await saveToPod(session, newDocObject);

  return newObj;
};

/**
 * Removes a document from the existing list and saves it to the pod
 *
 * @memberof DocumentList
 * @function removeDocument
 * @param {string} docName - name of doc to remove from list
 * @param {object} docListObject - object containing docList, dataset, and containerUrl
 * @param {SolidDataset} docListObject.dataset - dataset to save
 * @param {URL} docListObject.containerUrl - Url of dataset to save to
 * @param {Array} docListObject.docList - array of documents
 * @param {Session} session - session to use for saving
 * @returns {object} An new docListObject containing any updates
 */
export const removeDocument = async (docName, { docList, dataset, containerUrl }, session) => {
  const deletedDoc = docList.find((d) => d.name === docName);
  if (!deletedDoc) throw Error();
  const newList = docList.filter((d) => d.name !== docName);
  const cleanedDocName = docName.replaceAll(' ', '%20');
  const thingUrl = `${containerUrl}doclist.ttl#${cleanedDocName}`;
  const thingToRemove = getThing(dataset, thingUrl);
  const newDataset = removeThing(dataset, thingToRemove);
  const newDocObject = { userList: newList, dataset: newDataset, containerUrl };
  const newObj = await saveToPod(session, newDocObject);
  await deleteFile(deletedDoc.fileUrl, session);
  return newObj;
};

/**
 * Replaces a document with a new one
 *
 * @memberof DocumentList
 * @function replaceDocument
 * @param {object} docDesc - new document description
 * @param {object} file - new file to upload
 * @param {object} docListObject - object containing docList, dataset, and containerUrl
 * @param {SolidDataset} docListObject.dataset - dataset to save
 * @param {URL} docListObject.containerUrl - Url of dataset to save to
 * @param {Array} docListObject.docList - array of documents
 * @param {Session} session - session to use for saving
 * @returns {object} An new docListObject containing any updates
 */
export const replaceDocument = async (
  docDesc,
  file,
  { docList, dataset, containerUrl },
  session
) => {
  const updatedDataset = await removeDocument(
    file.name,
    { docList, dataset, containerUrl },
    session
  );
  const result = await addDocument(docDesc, file, updatedDataset, session);
  return result;
};

/**
 * Replaces a document with a new one
 *
 * @memberof DocumentList
 * @function loadDocumentList
 * @param {Session} session - session to use for saving
 * @param {URL} podUrl - pod to load from
 * @returns {object} An new docListObject containing any updates
 */
export const loadDocumentList = async (session, podUrl) => {
  const containerUrl = `${podUrl}PASS/Documents/`;
  let dataset;
  let docList;
  try {
    dataset = await getSolidDataset(`${containerUrl}doclist.ttl`, { fetch: session.fetch });
    docList = parseFromDataset(dataset);
  } catch {
    dataset = await saveSolidDatasetAt(`${containerUrl}doclist.ttl`, createSolidDataset(), {
      fetch: session.fetch
    });
    docList = [];
  }

  return { dataset, docList, containerUrl };
};
