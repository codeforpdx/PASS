/* eslint-disable */
import { afterEach } from 'vitest';
import createMatchMedia from './createMatchMedia';

afterEach(() => {
  window.matchMedia = createMatchMedia(1200);
});
/* eslint-enable */
