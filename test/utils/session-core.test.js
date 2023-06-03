import {
  mockSolidDatasetFrom,
  mockThingFrom,
  createSolidDataset,
  setThing
} from '@inrupt/solid-client';
import { expect, vi, it, describe, afterEach, beforeEach } from 'vitest';

const getSolidDataset = vi.fn((url) => Promise.resolve(mockSolidDatasetFrom(url)));
const createContainerAt = vi.fn((url) => Promise.resolve(mockSolidDatasetFrom(url)));
const saveSolidDatasetInContainer = vi.fn((url) => Promise.resolve(mockSolidDatasetFrom(url)));
const getSolidDatasetRejected = vi.fn(() => Promise.reject(Error('dataset not found')));
const setDocAclForUser = vi.fn(() => Promise.resolve());

const mockPodUrl = 'https://pod.example.com/';
const mockSolidIdentityProvider = 'https://example.com/';
let session = {};

describe('setDocAclPermission', () => {
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

describe('checkContainerPermission', () => {
  const otherPodUsername = 'pod2';
  const documentsContainerUrl = `https://${otherPodUsername}.${
    mockSolidIdentityProvider.split('/')[2]
  }/Documents/`;
  let catchExecuted = false;

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

  it('expect try block to be ran if getSolidDataset resolves', async () => {
    try {
      await getSolidDataset(documentsContainerUrl, { fetch: session.fetch });

      expect(getSolidDataset).toBeCalled();
    } catch {
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(false);
  });

  it('expect catch block to be ran if rejected', async () => {
    try {
      await getSolidDatasetRejected(documentsContainerUrl, { fetch: session.fetch });

      expect(getSolidDataset).toBeCalled();
    } catch {
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });
});

describe('create container logic for Solid', () => {
  const documentUrl = `${mockPodUrl}Documents/`;
  let catchExecuted = false;

  beforeEach(() => {
    session = {
      fetch: vi.fn()
    };
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('run try only if container exists', async () => {
    try {
      await getSolidDataset(documentUrl, { fetch: session.fetch });
      expect(getSolidDataset).toBeCalledWith(
        documentUrl,
        expect.objectContaining({ fetch: session.fetch })
      );
    } catch {
      catchExecuted = true;
      await createContainerAt(documentUrl, { fetch: session.fetch });
    }

    expect(createContainerAt).not.toBeCalled();
    expect(catchExecuted).toBe(false);
  });

  it('executes catch if getSolidDataset fails', async () => {
    try {
      await getSolidDatasetRejected(documentUrl, { fetch: session.fetch });
    } catch {
      catchExecuted = true;
      await createContainerAt(documentUrl, { fetch: session.fetch });

      expect(createContainerAt).toBeCalledWith(
        documentUrl,
        expect.objectContaining({ fetch: session.fetch })
      );
    }

    expect(getSolidDatasetRejected).toBeCalled();
    expect(catchExecuted).toBe(true);
  });
});

describe('createDocumentContainer', () => {
  const userContainerUrl = 'https://pod.example.com/Documents/';

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

  it('expect createContainerAt to be called 3 times', async () => {
    const createContainerList = [
      `${userContainerUrl}Bank%20Statement/`,
      `${userContainerUrl}Passport/`,
      `${userContainerUrl}Drivers%20License/`
    ];

    createContainerList.forEach(async (url) => {
      await createContainerAt(url, { fetch: session.fetch });
    });

    expect(createContainerAt).toBeCalledTimes(3);
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
