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
 * Asynchronously registers a user with a Solid Pod using an OpenID Connect (OIDC) provider.
 *
 * @async
 * @param {object} userData - User registration data.
 * @param {string} userData.email - User's email address for registration.
 * @param {string} userData.password - User's desired password.
 * @param {string} userData.confirmPassword - User's password confirmation.
 * @param {string} oidcProvider - The URL of the OIDC provider for registration.
 * @throws {Error} If there is an issue with the registration process.
 * @returns {Promise<object>} A Promise that resolves to the JSON response of the registration.
 */
const registerPod = async ({ email, password, confirmPassword }, oidcProvider) => {
  const [podName] = email.split('@');

  const oidcRegistrationPath = `${oidcProvider}idp/register/`;

  const body = {
    email,
    password,
    confirmPassword,
    podName,
    createWebId: true,
    createPod: true,
    rootPod: false,
    register: true
  };

  const response = await fetch(oidcRegistrationPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return response.json();
};

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

export { initializePod, registerPod };
