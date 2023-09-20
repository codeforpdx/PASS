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

  export default registerPod;