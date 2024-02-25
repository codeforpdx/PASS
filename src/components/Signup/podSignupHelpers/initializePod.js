// Inrupt Imports
import {
  createAcl,
  createContainerAt,
  getResourceAcl,
  getSolidDatasetWithAcl,
  setAgentDefaultAccess,
  setAgentResourceAccess,
  saveAclFor
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
const initializePod = async (webId, podUrl, caseManagerWebId, fetch) => {
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
  try {
    const caseManagerUrl = new URL(caseManagerWebId);
    acl = setAgentResourceAccess(acl, caseManagerUrl.href, {
      read: true,
      append: true,
      write: false,
      control: false
    });
    acl = setAgentDefaultAccess(acl, caseManagerUrl.href, {
      read: true,
      append: true,
      write: false,
      control: false
    });
  } catch {
    await saveAclFor(datasetWithAcl, acl, { fetch });
  } finally {
    await saveAclFor(datasetWithAcl, acl, { fetch });
  }
};

export default initializePod;
