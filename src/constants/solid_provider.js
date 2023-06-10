// Vite exposes static env variables in the `import.meta.env` object
// https://vitejs.dev/guide/env-and-mode.html
const OIDUrl =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_SOLID_IDENTITY_PROVIDER_DEV
    : import.meta.env.VITE_SOLID_IDENTITY_PROVIDER_PRODUCTION;

/**
 * The initial URL to a specific Solid Provider
 *
 * @name SOLID_IDENTITY_PROVIDER
 * @type {URL}
 * @memberof utils
 */

export const SOLID_IDENTITY_PROVIDER = OIDUrl.replace(/\r/g, '');

/**
 * The URL to a specific Solid Provider after login
 *
 * @name currentOidcIssuer
 * @type {URL}
 * @memberof utils
 */

export const currentOidcIssuer = localStorage.getItem('oidcIssuer') ?? SOLID_IDENTITY_PROVIDER;
