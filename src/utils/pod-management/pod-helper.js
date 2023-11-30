import { createContainerAt, getSolidDatasetWithAcl, hasResourceAcl } from '@inrupt/solid-client';
import { setDocAclForPublic, setDocAclForUser } from '../network/session-helper';

/**
 * @typedef {import('@inrupt/solid-client-authn-browser').Session} Session
 */

/**
 * @typedef {import('@inrupt/solid-client').Access} Access
 */

/**
 * Function that generates an ACL file for a specific container when logging
 * in for the first time with a specific permissions for public, or if that
 * specific container is the .acl file missing, regenerates it with an ACL with
 * access to the user
 *
 * @memberof utils
 * @function generateACL
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {URL} podUrl - The user's Pod URL
 * @param {string} name - Name of container
 * @param {Access} [permissions] - Access Object for Public users in ACL file
 * @returns {Promise} Promise - Generates a PASS-specific container for Pod upon
 * log in if user's Pod does not have that container to begin with and generates
 * an ACL file for it if container doesn't have an ACL file
 */
export const generateACL = async (session, podUrl, name, permissions = null) => {
  const containerUrl = `${podUrl}PASS/${name}/`;

  try {
    const solidDataset = await getSolidDatasetWithAcl(containerUrl, {
      fetch: session.fetch
    });

    // Checks for ACL file with container, if it doesn't exist, it'll regenerate
    // a new ACL file
    const resourceAclExists = hasResourceAcl(solidDataset);

    if (!resourceAclExists) {
      await setDocAclForUser(session, containerUrl, 'create', session.info.webId);
      if (permissions) {
        await setDocAclForPublic(session, containerUrl, permissions);
      }
    }
  } catch (error) {
    throw new Error('Failed to generate ACL file: ', error);
  }
};

/**
 * Function that creates a PASS-specific container in the user's Pod when logging
 * in for the first time, or if that specific container is missing, re-initialize
 * it with an ACL with access to the user
 *
 * @memberof utils
 * @function createPASSContainer
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {URL} podUrl - The user's Pod URL
 * @param {string} name - Name of container
 * @param {Access} [permissions] - Access Object for Public users in ACL file
 * @returns {Promise} Promise - Generates a PASS-specific container for Pod upon
 * log in if user's Pod does not have that container to begin with and generates
 * an ACL file for it if container doesn't have an ACL file
 */
const createPASSContainer = async (session, podUrl, name, permissions = null) => {
  const containerUrl = `${podUrl}PASS/${name}/`;

  try {
    const solidDataset = await getSolidDatasetWithAcl(containerUrl, {
      fetch: session.fetch
    });

    // Checks for ACL file with container, if it doesn't exist, it'll regenerate
    // a new ACL file
    const resourceAclExists = hasResourceAcl(solidDataset);

    if (!resourceAclExists) {
      await setDocAclForUser(session, containerUrl, 'create', session.info.webId);
      if (permissions) {
        await setDocAclForPublic(session, containerUrl, permissions);
      }
    }
  } catch {
    await createContainerAt(containerUrl, { fetch: session.fetch });

    // Generate ACL file for container
    await setDocAclForUser(session, containerUrl, 'create', session.info.webId);
    if (permissions) {
      await setDocAclForPublic(session, containerUrl, permissions);
    }
  }
};

export default createPASSContainer;
