import { SOLID_IDENTITY_PROVIDER } from './session-helper';

const keysToRemove = [
  'loggedIn',
  'redirectUrl',
  'restorePath',
  'oidcProvider',
  `issuerConfig:${SOLID_IDENTITY_PROVIDER}`,
  `issuerConfig:${SOLID_IDENTITY_PROVIDER.slice(0, -1)}`
];

const removeKeys = () => {
  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
  });
};

export default removeKeys;
