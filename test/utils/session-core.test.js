import { getSolidDataset, createContainerAt, mockSolidDatasetFrom } from '@inrupt/solid-client';
import { expect, vi, it, describe, afterEach, beforeEach } from 'vitest';
import { getContainerUrl } from '../../src/utils/network/session-helper';
import { INTERACTION_TYPES } from '../../src/constants';

vi.mock('@inrupt/solid-client', async () => {
  const actual = await vi.importActual('@inrupt/solid-client');
  return {
    ...actual,
    getSolidDataset: vi.fn((url) => Promise.resolve(mockSolidDatasetFrom(url))),
    createContainerAt: vi.fn((url) => Promise.resolve(mockSolidDatasetFrom(url)))
  };
});

const getSolidDatasetRejected = vi.fn(() => Promise.reject(Error('dataset not found')));

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

  it("prints out correct documentUrl for Driver's License and webId for other user", () => {
    const fileType = "Driver's License";
    const otherPodUsername = 'pod2';
    const documentUrl = getContainerUrl(session, fileType, INTERACTION_TYPES.SELF);
    const webId = `https://${otherPodUsername}.${
      mockSolidIdentityProvider.split('/')[2]
    }/profile/card#me`;

    expect(documentUrl).toBe('https://pod.example.com/Drivers%20License/');
    expect(webId).toBe('https://pod2.example.com/profile/card#me');
  });
});

const setDocAclForUser = vi.fn(() => Promise.resolve());

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
    const containerUrl = getContainerUrl(session, 'Documents', INTERACTION_TYPES.SELF);
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
