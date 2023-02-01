import {
  getSourceUrl,
  saveFileInContainer,
  createContainerAt,
  getSolidDataset,
  getThingAll,
  createThing,
  buildThing,
  setThing,
  saveSolidDatasetAt,
  createSolidDataset,
  saveSolidDatasetInContainer,
} from "@inrupt/solid-client";
import { SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";

export const SOLID_IDENTITY_PROVIDER = "https://opencommons.net";

export const handleFiles = async (fileObject, session) => {
  const POD_URL = String(session.info.webId.split("profile")[0]);

  // Generating Directory for document
  const documentFolder = POD_URL + fileObject.type;
  await createContainerAt(documentFolder, { fetch: session.fetch }).then((response) => {
    console.log(`Dataset Information`, response);
  });

  // Storing File in Document
  await placeFileInContainer(fileObject, `${documentFolder}`, session);

  // Setting url to location of document directory
  const solidDatasetUrl = documentFolder;
  let getDatasetFromUrl = await getSolidDataset(solidDatasetUrl, { fetch: session.fetch });

  // Sub-routine to check for existing ttl files in directory
  const hasTTLFiles = () => {
    const items = getThingAll(getDatasetFromUrl);
    if (!items) {
      return [];
    }
    const ttlFiles = items.find((item) => item.url.slice(-3) === "ttl");
    if (ttlFiles) {
      return ttlFiles;
    } else {
      return [];
    }
  };

  const ttlFile = hasTTLFiles();

  const toBeUpdated = buildThing(createThing({ name: fileObject.file.name }))
    .addStringNoLocale(SCHEMA_INRUPT.name, fileObject.file.name)
    .addStringNoLocale(SCHEMA_INRUPT.identifier, fileObject.type)
    .addStringNoLocale(SCHEMA_INRUPT.endDate, fileObject.date)
    .addStringNoLocale(SCHEMA_INRUPT.description, fileObject.description)
    .build();

  console.log("TTL url", ttlFile);

  let myDataset;
  if (ttlFile) {
    myDataset = await getSolidDataset(ttlFile, { fetch: session.fetch });
    console.log("Call original dataset: ", myDataset);

    myDataset = setThing(myDataset, toBeUpdated);

    await saveSolidDatasetAt(ttlFile, solidDatasetUrl, myDataset, { fetch: session.fetch }).then((result) => {
      console.log("New dataset: ", result);
    });
  } else {
    let courseSolidDataset = createSolidDataset();

    courseSolidDataset = setThing(courseSolidDataset, toBeUpdated);

    await saveSolidDatasetInContainer(solidDatasetUrl, courseSolidDataset, { fetch: session.fetch }).then((result) => {
      console.log("newly generated and uploaded dataset: ", result);
    });
  }

  console.log(
    `Uploaded ${fileObject.file.name} to pod successfully and set identifier to ${fileObject.type}, end date to ${fileObject.date}, and description to ${fileObject.description}`
  );
};

const placeFileInContainer = async (fileObject, targetContainerUrl, session) => {
  try {
    const savedFile = await saveFileInContainer(targetContainerUrl, fileObject.file, {
      slug: fileObject.file.name,
      contentType: fileObject.type,
      fetch: session.fetch,
    });
    console.log(`File saved at ${getSourceUrl(savedFile)}`);
  } catch (error) {
    console.log(error);
  }
};
