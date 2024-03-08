// Inrupt Imports
import { RDF_PREDICATES } from '@constants';
import {
  buildThing,
  createThing,
  createAcl,
  createContainerAt,
  createSolidDataset,
  getResourceAcl,
  getSolidDatasetWithAcl,
  saveSolidDatasetAt,
  setAgentDefaultAccess,
  setAgentResourceAccess,
  saveAclFor,
  setThing
} from '@inrupt/solid-client';

/**
 * Asynchronously initializes a Solid pod by creating a container, setting access control, and ACL rules.
 *
 * @async
 * @param {string} webId - The WebID of the user.
 * @param {string} podUrl - The URL of the Solid pod.
 * @param {string|null} caseManagerWebId - The WebID of the case manager (optional, can be `null`).
 * @param {Function} fetch - The fetch function for making HTTP requests.
 * @throws {Error} If there are issues with creating containers or setting access control.
 */
const initializePod = async (
  webId,
  podUrl,
  { caseManagerWebId, caseManagerFirstName, caseManagerLastName },
  fetch
) => {
  await createContainerAt(`${podUrl}PASS`, { fetch });
  let datasetWithAcl;
  let acl;
  try {
    datasetWithAcl = await getSolidDatasetWithAcl(`${podUrl}PASS/`, { fetch });
    acl = getResourceAcl(datasetWithAcl) ?? createAcl(datasetWithAcl);
  } catch {
    acl = createAcl(datasetWithAcl);
  }
  acl = setAgentResourceAccess(acl, webId, {
    read: true,
    append: true,
    write: true,
    control: true
  });
  acl = setAgentDefaultAccess(acl, webId, {
    read: true,
    append: true,
    write: true,
    control: true
  });
  if (caseManagerWebId && caseManagerWebId !== 'null') {
    acl = setAgentResourceAccess(acl, caseManagerWebId, {
      read: true,
      append: true,
      write: false,
      control: false
    });
    acl = setAgentDefaultAccess(acl, caseManagerWebId, {
      read: true,
      append: true,
      write: false,
      control: false
    });
    let contactsList = createSolidDataset();
    let builder = buildThing(createThing({ name: encodeURIComponent(caseManagerWebId) }))
      .addUrl(RDF_PREDICATES.identifier, caseManagerWebId)
      .addUrl(RDF_PREDICATES.URL, caseManagerWebId.split('profile')[0]);

    if (caseManagerFirstName) {
      builder = builder.addStringNoLocale(RDF_PREDICATES.givenName, caseManagerFirstName);
    }
    if (caseManagerLastName) {
      builder = builder.addStringNoLocale(RDF_PREDICATES.familyName, caseManagerLastName);
    }
    const caseManagerContact = builder.build();
    contactsList = setThing(contactsList, caseManagerContact);
    await saveSolidDatasetAt(`${podUrl}PASS/Users/userlist.ttl`, contactsList, { fetch });
  }
  await saveAclFor(datasetWithAcl, acl, { fetch });

  await createContainerAt(`${podUrl}PASS/Documents`, { fetch });
  await saveSolidDatasetAt(`${podUrl}PASS/Documents/doclist.ttl`, createSolidDataset(), {
    fetch
  });
};

export default initializePod;
