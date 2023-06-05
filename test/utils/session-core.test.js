import {
  mockSolidDatasetFrom,
  mockThingFrom,
  createSolidDataset,
  setThing,
  getSolidDataset
} from '@inrupt/solid-client';
import { expect, vi, it, describe, afterEach, beforeEach } from 'vitest';
import { getDocuments } from '../../src/utils/network/session-core';

const mockPodUrl = 'https://pod.example.com/';
const mockSolidIdentityProvider = 'https://example.com/';
let session = {};

describe('setDocAclPermission', () => {
  const setDocAclForUser = vi.fn(() => Promise.resolve());

  beforeEach(() => {
    session = {
      fetch: vi.fn(),
      info: {
        webId: `${mockPodUrl}profile/card#me`
      }
    };
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('prints out correct documentUrl and webId for other user and calls setDocAclForUser', async () => {
    const otherPodUsername = 'pod2';
    const permissions = { read: true };

    const documentUrl = 'https://pod.example.com/Drivers%20License/';
    const webId = `https://${otherPodUsername}.${
      mockSolidIdentityProvider.split('/')[2]
    }/profile/card#me`;

    await setDocAclForUser(session, documentUrl, 'update', webId, permissions);

    expect(setDocAclForUser).toBeCalledWith(session, documentUrl, 'update', webId, permissions);
    expect(documentUrl).toBe('https://pod.example.com/Drivers%20License/');
    expect(webId).toBe('https://pod2.example.com/profile/card#me');
  });
});

describe('setDocContainerAclPermission', () => {
  const setDocAclForUser = vi.fn(() => Promise.resolve());

  beforeEach(() => {
    session = {
      fetch: vi.fn(),
      info: {
        webId: `${mockPodUrl}profile/card#me`
      }
    };
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls setDocAclForUser 4 times', async () => {
    const otherPodUsername = 'pod2';
    const permissions = { read: true, write: true, append: true, control: false };
    const containerUrl = 'https://pod.example.com/Documents/';
    const urlsToSet = [
      containerUrl,
      `${containerUrl}Bank%20Statement/`,
      `${containerUrl}Passport/`,
      `${containerUrl}Drivers%20License/`
    ];

    const webId = `https://${otherPodUsername}.${
      mockSolidIdentityProvider.split('/')[2]
    }/profile/card#me`;

    urlsToSet.forEach(async (url) => {
      await setDocAclForUser(session, url, 'update', webId, permissions);
    });

    expect(setDocAclForUser).toBeCalledTimes(4);
  });
});

describe('createDocumentContainer', () => {
  const userContainerUrl = 'https://pod.example.com/Documents/';
  const createContainerAt = vi.fn((url) => Promise.resolve(mockSolidDatasetFrom(url)));
  const saveSolidDatasetInContainer = vi.fn((url) => Promise.resolve(mockSolidDatasetFrom(url)));
  const setDocAclForUser = vi.fn(() => Promise.resolve());

  beforeEach(() => {
    session = {
      fetch: vi.fn(),
      info: {
        webId: `${mockPodUrl}profile/card#me`
      }
    };
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('expect new TTL file to be created, set, and saved to container with ACL set', async () => {
    const createContainerList = [
      `${userContainerUrl}Bank%20Statement/`,
      `${userContainerUrl}Passport/`,
      `${userContainerUrl}Drivers%20License/`
    ];

    createContainerList.forEach(async (url) => {
      await createContainerAt(url, { fetch: session.fetch });
    });

    const newTtlFile = mockThingFrom(userContainerUrl);

    let newSolidDataset = createSolidDataset();
    newSolidDataset = setThing(newSolidDataset, newTtlFile);

    await saveSolidDatasetInContainer(userContainerUrl, newSolidDataset, {
      slugSuggestion: 'container.ttl',
      contentType: 'text/turtle',
      fetch: session.fetch
    });

    expect(saveSolidDatasetInContainer).toBeCalledWith(userContainerUrl, newSolidDataset, {
      slugSuggestion: 'container.ttl',
      contentType: 'text/turtle',
      fetch: session.fetch
    });

    await setDocAclForUser(session, userContainerUrl, 'create', session.info.webId);
    createContainerList.forEach(async (url) => {
      await setDocAclForUser(session, url, 'create', session.info.webId);
    });

    expect(setDocAclForUser).toBeCalledTimes(4);
  });
});

vi.mock('@inrupt/solid-client', async () => {
  const actual = await vi.importActual('@inrupt/solid-client');
  return {
    ...actual,
    getSolidDataset: vi.fn(() => Promise.resolve())
  };
});

describe('getDocuments', () => {
  beforeEach(() => {
    session = {
      fetch: vi.fn(),
      info: {
        webId: `${mockPodUrl}profile/card#me`
      }
    };
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns documentUrl if getSolidDataset resolves', async () => {
    const results = await getDocuments(session, 'Passport', 'self');

    expect(results).toBe('https://pod.example.com/Passport/');
  });

  it('throws an error if getSolidDataset is rejected', async () => {
    getSolidDataset.mockRejectedValueOnce(Error('No data found'));

    await expect(getDocuments(session, 'Passport', 'self')).rejects.toThrow('No data found');
  });
});
