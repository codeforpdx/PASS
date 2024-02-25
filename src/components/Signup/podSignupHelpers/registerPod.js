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
 * @returns {Promise<object>} A Promise that resolves to the JSON response of the registration.
 */
const registerPod = async ({ email, password }, oidcProvider) => {
  // See https://communitysolidserver.github.io/CommunitySolidServer/latest/usage/account/json-api/
  // For API
  const res = await fetch(`${oidcProvider}.account/`, { headers: { Accepts: 'application/json' } });
  const { controls } = await res.json();
  const createResp = await fetch(controls.account.create, { method: 'POST' });
  const newAccountAuth = await createResp.json();
  const authResponse = await fetch(`${oidcProvider}.account/`, {
    headers: { Authorization: `CSS-Account-Token ${newAccountAuth.authorization}` }
  });
  const { controls: authControls } = await authResponse.json();
  await fetch(authControls.password.create, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `CSS-Account-Token ${newAccountAuth.authorization}`
    },
    body: JSON.stringify({ email, password })
  });
  await fetch(authControls.account.pod, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `CSS-Account-Token ${newAccountAuth.authorization}`
    },
    body: JSON.stringify({ name: email.split('@')[0] })
  });
};

export default registerPod;
