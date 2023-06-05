import { getSolidDataset } from '@inrupt/solid-client';
import { expect, vi, it, describe, afterEach, beforeEach } from 'vitest';
import {
  checkContainerPermission,
  deleteDocumentFile,
  getDocuments
} from '../../src/utils/network/session-core';

const mockPodUrl = 'https://pod.example.com/';
let session = {};

vi.mock('@inrupt/solid-client', async () => {
  const actual = await vi.importActual('@inrupt/solid-client');
  return {
    ...actual,
    getSolidDataset: vi.fn(() => Promise.resolve()),
    deleteFile: vi.fn(() => Promise.resolve())
  };
});

vi.mock('../../src/utils/network/session-helper', async () => {
  const actual = await vi.importActual('../../src/utils/network/session-helper');
  return {
    ...actual,
    setDocAclForUser: vi.fn(() => Promise.resolve()),
    SOLID_IDENTITY_PROVIDER: 'https://example.com/',
    getContainerUrlAndFiles: vi.fn(() => [
      'https://pod.example.com/Passport/',
      [
        { url: 'https://pod.example.com/Passport/document.ttl' },
        { url: 'https://pod.example.com/Passport/uploaded.pdf' }
      ]
    ])
  };
});

describe('checkContainerPermission', () => {
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
  const otherPodUsername = 'pod2';

  it('returns containerUrl if getSolidDataset resolves', async () => {
    const results = await checkContainerPermission(session, otherPodUsername);

    expect(results).toBe('https://pod2.example.com/Documents/');
  });

  it('throws an error if getSolidDataset is rejected', async () => {
    getSolidDataset.mockRejectedValueOnce(Error('No data found'));

    await expect(checkContainerPermission(session, otherPodUsername)).rejects.toThrow(
      'No data found'
    );
  });
});

describe('deleteDocuments', () => {
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

  it('returns containerUrl after deleting all files inside', async () => {
    const containerUrl = await deleteDocumentFile(session, 'Passport');

    expect(containerUrl).toBe('https://pod.example.com/Passport/');
  });
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
