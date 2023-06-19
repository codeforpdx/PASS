import {
  getSolidDataset,
  setThing,
  getThingAll,
  saveSolidDatasetAt,
  createSolidDataset,
  saveFileInContainer,
  getThing,
  removeThing,
  deleteFile
} from '@inrupt/solid-client';

import { makeDocIntoThing, parseDocFromThing } from './Document';

const parseFromDataset = async (docsDataset, session) => {
  const docList = [];
  const allDocThings = getThingAll(docsDataset);
  await Promise.all(
    allDocThings.map(async (userThing) => {
      const docObject = await parseDocFromThing(userThing, session);
      docList.push(docObject);
    })
  );

  return docList;
};

const saveToPod = async (session, { dataset, containerUrl }) => {
  const newDataset = await saveSolidDatasetAt(`${containerUrl}doclist.ttl`, dataset, {
    fetch: session.fetch
  });
  const newList = await parseFromDataset(newDataset, session);
  return { dataset: newDataset, docList: newList, containerUrl };
};

export const addDocument = async (docDesc, file, { docList, dataset, containerUrl }, session) => {
  if (docList.find((oldDoc) => oldDoc.name === docDesc.name))
    throw new Error('File already exists');
  const docThing = await makeDocIntoThing(docDesc, containerUrl, file);
  const newDocDesc = parseDocFromThing(docThing);
  const newDocObject = {
    docList: docList.concat([newDocDesc]),
    dataset: setThing(dataset, docThing),
    containerUrl
  };
  const newObj = await saveToPod(session, newDocObject);
  await saveFileInContainer(`${containerUrl}`, file, {
    fetch: session.fetch,
    slug: file.name
  });
  return newObj;
};

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

export const loadDocumentList = async (session, podUrl) => {
  const containerUrl = `${podUrl}PASS/Documents/`;
  let dataset;
  let docList;
  try {
    dataset = await getSolidDataset(`${containerUrl}doclist.ttl`, { fetch: session.fetch });
    docList = await parseFromDataset(dataset, session);
  } catch {
    dataset = await saveSolidDatasetAt(`${containerUrl}doclist.ttl`, createSolidDataset(), {
      fetch: session.fetch
    });
    docList = [];
  }
  return { dataset, docList, containerUrl };
};
