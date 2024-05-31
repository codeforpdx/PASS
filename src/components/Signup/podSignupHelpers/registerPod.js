import {
  createDpopHeader,
  generateDpopKeyPair,
  buildAuthenticatedFetch
} from '@inrupt/solid-client-authn-core';
import handleIncomingHTTPErrors from './handleHTTPErrors';
/**
 * @typedef RegistrationDoc
 * @property {string} podUrl - The URL of the pod created during registration
 * @property {string} webId - The WebID created during registration
 * @property {Function} fetch - An authenticated fetch that can be used to modify the pod
 */

/**
 * Registers a user with a Solid Pod using an OpenID Connect (OIDC) provider.
 * This function works with Community Solid Server v7
 * No other solid servers are supported
 *
 * @async
 * @param {object} userData - User registration data.
 * @param {string} userData.email - User's email address for registration.
 * @param {string} userData.password - User's desired password.
 * @param {string} oidcProvider - The URL of the OIDC provider for registration.
 * @throws {Error} If there is an issue with the registration process.
 * @returns {Promise<RegistrationDoc>} A Promise that resolves to an object containing all info needed to set up the user's pod
 */
const registerPod = async ({ email, password }, oidcProvider) => {
  // See https://communitysolidserver.github.io/CommunitySolidServer/latest/usage/account/json-api/
  // For API
  // Create User account, web ID, and Pod

  const res = await fetch(`${oidcProvider}.account/`, { headers: { Accepts: 'application/json' } });
  const { controls } = await res.json();
  const createResp = await fetch(controls.account.create, { method: 'POST' });
  const newAccountAuth = await createResp.json();
  const response = await fetch(`${oidcProvider}.account/`, {
    headers: { Authorization: `CSS-Account-Token ${newAccountAuth.authorization}` }
  });

  const { controls: createControls } = await response.json();
  const createHeaders = {
    'Content-Type': 'application/json',
    Authorization: `CSS-Account-Token ${newAccountAuth.authorization}`
  };
  const createControlsResp = await fetch(createControls.password.create, {
    method: 'POST',
    headers: createHeaders,
    body: JSON.stringify({ email, password })
  });
  handleIncomingHTTPErrors(await createControlsResp.json());

  const podResp = await fetch(createControls.account.pod, {
    method: 'POST',
    headers: createHeaders,
    body: JSON.stringify({ name: email.split('@')[0] })
  });
  const podBody = await podResp.json();
  const { pod: podUrl, webId } = podBody;
  const loginResp = await fetch(createControls.password.login, {
    method: 'POST',
    headers: createHeaders,
    body: JSON.stringify({ email, password })
  });

  // Generate Client Credentials for authenticated requests.
  // See https://communitysolidserver.github.io/CommunitySolidServer/latest/usage/client-credentials/
  const loginToken = await loginResp.json();
  const loginHeaders = {
    'Content-Type': 'application/json',
    Authorization: `CSS-Account-Token ${loginToken.authorization}`
  };
  const indexResponse = await fetch(`${oidcProvider}.account/`, {
    headers: {
      Authorization: `CSS-Account-Token ${loginToken.authorization}`
    }
  });
  const { controls: clientControls } = await indexResponse.json();
  const clientCredentialsResponse = await fetch(clientControls.account.clientCredentials, {
    method: 'POST',
    headers: loginHeaders,
    body: JSON.stringify({ name: `PASS-REGISTRATION-${email}`, webId })
  });
  const { id, secret } = await clientCredentialsResponse.json();

  // Request Temporary Access Token
  const dpopKey = await generateDpopKeyPair();
  const authString = `${encodeURIComponent(id)}:${encodeURIComponent(secret)}`;
  const openIdConfigResponse = await fetch(`${oidcProvider}.well-known/openid-configuration`);
  const { token_endpoint: tokenUrl } = await openIdConfigResponse.json();
  const tokenResponse = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      // The header needs to be in base64 encoding.
      authorization: `Basic ${btoa(authString)}`,
      'content-type': 'application/x-www-form-urlencoded',
      dpop: await createDpopHeader(tokenUrl, 'POST', dpopKey)
    },
    body: 'grant_type=client_credentials&scope=webid'
  });

  const { access_token: accessToken } = await tokenResponse.json();
  const authFetch = await buildAuthenticatedFetch(accessToken, { dpopKey });

  return { podUrl, webId, fetch: authFetch };
};

export default registerPod;
