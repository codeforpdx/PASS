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
const mockWebId2 = 'https://pod2.example.com/';
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

describe('create container logic for Solid', () => {
  beforeEach(() => {
    session = {
      fetch: vi.fn()
    };
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('run try only if container exists', async () => {
    const documentUrl = `${mockPodUrl}Documents/`;
    let catchExecuted = false;

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
    const documentUrl = `${mockPodUrl}Documents/`;
    let catchExecuted = false;

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
