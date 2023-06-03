import { getSolidDataset, createContainerAt, mockSolidDatasetFrom } from '@inrupt/solid-client';
import { expect, vi, it, describe, afterEach, beforeEach } from 'vitest';

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
let session = {};

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
