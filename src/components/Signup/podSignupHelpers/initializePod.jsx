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
  try {
    await createContainerAt(`${podUrl}PASS`, { fetch });
  } finally {
    const datasetWithAcl = await getSolidDatasetWithAcl(`${podUrl}PASS/`, { fetch });
    let acl = getResourceAcl(datasetWithAcl) ?? createAcl(datasetWithAcl);

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

    if (caseManagerWebId) {
      acl = setAgentResourceAccess(acl, caseManagerWebId, {
        read: true,
        append: true,
        write: true,
        control: false
      });
      acl = setAgentDefaultAccess(acl, caseManagerWebId, {
        read: true,
        append: true,
        write: true,
        control: false
      });
    }
    await saveAclFor(datasetWithAcl, acl, { fetch });
  }
};

export default initializePod;
