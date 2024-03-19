/* eslint-disable */
import { afterEach } from 'vitest';
import createMatchMedia from './createMatchMedia';

// process.env.VITE_SOLID_IDENTITY_PROVIDER = 'https://solidcommunity.net',
// process.env.VITE_SUGGESTED_OIDC_OPTIONS = 'http://testurl_1.com/, http://testurl_2.com/, http://testurl_3.com/'

afterEach(() => {
  window.matchMedia = createMatchMedia(1200);
});
/* eslint-enable */
